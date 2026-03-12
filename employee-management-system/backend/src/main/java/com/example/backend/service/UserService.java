package com.example.backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ProfileUpdateRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.PasswordPolicy;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(@NonNull String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return Optional.ofNullable(userRepository.findFirstByEmail(email));
    }

    public User createUser(@NonNull User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (userRepository.findFirstByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already in use");
        }
        if (user.getStatus() == null) user.setStatus("ACTIVE");
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }
        PasswordPolicy.validateOrThrow(user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(Objects.requireNonNull(user));
    }

    public User updateUser(@NonNull String id, @NonNull User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
        if (userDetails.getRole() != null) user.setRole(userDetails.getRole());
        if (userDetails.getName() != null) user.setName(userDetails.getName());
        if (userDetails.getPhone() != null) user.setPhone(userDetails.getPhone());
        if (userDetails.getAddress() != null) user.setAddress(userDetails.getAddress());
        if (userDetails.getStatus() != null) user.setStatus(userDetails.getStatus());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            PasswordPolicy.validateOrThrow(userDetails.getPassword());
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        return userRepository.save(Objects.requireNonNull(user));
    }

    public void deleteUser(@NonNull String id) {
        userRepository.deleteById(id);
    }

    public List<User> searchUsers(String query) {
        if (query == null || query.isBlank()) return userRepository.findAll();
        return userRepository.findByEmailContainingIgnoreCaseOrRoleContainingIgnoreCaseOrNameContainingIgnoreCase(
                query, query, query);
    }

    public List<User> searchWithFilters(String query, String roleFilter, String statusFilter, String sortBy) {
        List<User> users = searchUsers(query);
        if (roleFilter != null && !roleFilter.isBlank() && !roleFilter.equals("ALL")) {
            users = users.stream()
                    .filter(u -> roleFilter.equals(u.getRole()))
                    .collect(Collectors.toList());
        }
        if (statusFilter != null && !statusFilter.isBlank() && !statusFilter.equals("ALL")) {
            users = users.stream()
                    .filter(u -> statusFilter.equals(u.getStatus()))
                    .collect(Collectors.toList());
        }
        if (sortBy != null) {
            switch (sortBy) {
                case "name_asc":
                    users = users.stream()
                            .sorted(Comparator.comparing(u -> (u.getName() != null ? u.getName() : u.getEmail())))
                            .collect(Collectors.toList());
                    break;
                case "newest":
                    users = users.stream().sorted((a, b) -> {
                        if (a.getCreatedAt() == null) return 1;
                        if (b.getCreatedAt() == null) return -1;
                        return b.getCreatedAt().compareTo(a.getCreatedAt());
                    }).collect(Collectors.toList());
                    break;
                case "oldest":
                    users = users.stream().sorted((a, b) -> {
                        if (a.getCreatedAt() == null) return 1;
                        if (b.getCreatedAt() == null) return -1;
                        return a.getCreatedAt().compareTo(b.getCreatedAt());
                    }).collect(Collectors.toList());
                    break;
                default:
                    break;
            }
        }
        return users;
    }

    public List<User> getRecentUsers(int count) {
        return userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(count)
                .collect(Collectors.toList());
    }

    public User updateProfile(String email, ProfileUpdateRequest req) {
        User user = userRepository.findFirstByEmail(email);
        if (user == null) throw new RuntimeException("User not found");
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getAddress() != null) user.setAddress(req.getAddress());
        return userRepository.save(user);
    }

    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findFirstByEmail(email);
        if (user == null) throw new RuntimeException("User not found");
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Invalid current password");
        }
        PasswordPolicy.validateOrThrow(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User updateProfilePhoto(String email, String photoUrl) {
        User user = userRepository.findFirstByEmail(email);
        if (user == null) throw new RuntimeException("User not found");
        user.setProfilePhoto(photoUrl);
        return userRepository.save(user);
    }

    public User removeProfilePhoto(String email) {
        User user = userRepository.findFirstByEmail(email);
        if (user == null) throw new RuntimeException("User not found");
        user.setProfilePhoto(null);
        return userRepository.save(user);
    }
}