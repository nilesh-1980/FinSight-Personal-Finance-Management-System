package com.finsight.controller;

import com.finsight.dto.LoginRequest;
import com.finsight.dto.RegisterRequest;
import com.finsight.entity.User;
import com.finsight.repository.UserRepository;
import com.finsight.service.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        if (userRepository.findByEmail(request.email).isPresent()) {
            return "Email already exists";
        }

        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPassword(passwordEncoder.encode(request.password));

        userRepository.save(user);

        return "User Registered Successfully";
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return Map.of(
                "message", "Login Successful",
                "token", token,
                "email", user.getEmail(),
                "role", user.getRole()
        );
    }
}