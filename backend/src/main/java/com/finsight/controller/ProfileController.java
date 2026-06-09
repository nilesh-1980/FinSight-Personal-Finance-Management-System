package com.finsight.controller;

import com.finsight.dto.ChangePasswordRequest;
import com.finsight.entity.User;
import com.finsight.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository,
                             PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get Profile Details
    @GetMapping("/{email}")
    public Map<String, String> getProfile(@PathVariable String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "photoUrl",
                user.getPhotoUrl() == null ? "" : user.getPhotoUrl()
        );
    }

    // Upload Profile Photo
    @PostMapping("/upload-photo/{email}")
    public String uploadPhoto(@PathVariable String email,
                              @RequestParam("file") MultipartFile file) throws Exception {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String uploadDir = "uploads/profile/";

        Files.createDirectories(Paths.get(uploadDir));

        String fileName =
                System.currentTimeMillis()
                        + "_"
                        + file.getOriginalFilename();

        Path filePath = Paths.get(uploadDir + fileName);

        Files.write(filePath, file.getBytes());

        String photoUrl =
                "http://localhost:8080/profile-images/"
                        + fileName;

        user.setPhotoUrl(photoUrl);

        userRepository.save(user);

        return photoUrl;
    }

    // Change Password
    @PutMapping("/change-password")
    public String changePassword(
            @RequestBody ChangePasswordRequest request) {

        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                request.oldPassword,
                user.getPassword())) {

            return "Old password is incorrect";
        }

        user.setPassword(
                passwordEncoder.encode(request.newPassword));

        userRepository.save(user);

        return "Password changed successfully";
    }
}