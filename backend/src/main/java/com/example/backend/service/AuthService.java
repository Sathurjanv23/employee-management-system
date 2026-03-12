package com.example.backend.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.PasswordPolicy;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public User register(RegisterRequest request) {
        if (userRepository.findFirstByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already in use");
        }
        PasswordPolicy.validateOrThrow(request.getPassword());
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "EMPLOYEE");
        user.setName(request.getName());
        user.setStatus("ACTIVE");
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findFirstByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public String requestPasswordReset(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        User user = userRepository.findFirstByEmail(email.trim());
        if (user == null) {
            return null;
        }

        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        String resetLink = frontendBaseUrl + "/reset-password?token=" + token;
        boolean mailSent = sendResetEmail(user.getEmail(), resetLink);
        return mailSent ? null : resetLink;
    }

    public void resetPassword(String token, String newPassword) {
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Reset token is required");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("New password is required");
        }

        User user = userRepository.findFirstByResetPasswordToken(token.trim());
        if (user == null) {
            throw new RuntimeException("Invalid reset token");
        }
        if (user.getResetPasswordTokenExpiry() == null
                || user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired. Please request again.");
        }

        PasswordPolicy.validateOrThrow(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }

    private boolean sendResetEmail(String toEmail, String resetLink) {
        if (mailFrom == null || mailFrom.isBlank()) {
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request - Employee Management System");
            message.setText("Hello,\n\n"
                    + "We received a request to reset your password.\n"
                    + "Use this link to set a new password (valid for 30 minutes):\n"
                    + resetLink + "\n\n"
                    + "If you did not request this, please ignore this email.\n");
            mailSender.send(message);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}