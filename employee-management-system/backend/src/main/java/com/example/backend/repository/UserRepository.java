package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findFirstByEmail(String email);
    User findFirstByResetPasswordToken(String resetPasswordToken);
    List<User> findByEmailContainingIgnoreCaseOrRoleContainingIgnoreCaseOrNameContainingIgnoreCase(
            String email, String role, String name);
}