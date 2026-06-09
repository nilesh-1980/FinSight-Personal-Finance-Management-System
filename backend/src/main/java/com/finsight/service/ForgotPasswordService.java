package com.finsight.service;

import com.finsight.entity.User;
import com.finsight.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class ForgotPasswordService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, String> otpStorage = new HashMap<>();

    public ForgotPasswordService(UserRepository userRepository,
                                 JavaMailSender mailSender,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    public String sendOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        otpStorage.put(email, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("FinSight Password Reset OTP");
        message.setText("Hello " + user.getName()
                + ",\n\nYour FinSight password reset OTP is: "
                + otp
                + "\n\nThis OTP is valid for a short time.\n\nRegards,\nFinSight Team");

        mailSender.send(message);

        return "OTP sent to your email";
    }

    public String verifyOtp(String email, String otp) {

        String storedOtp = otpStorage.get(email);

        if (storedOtp == null) {
            return "OTP not found. Please request again.";
        }

        if (!storedOtp.equals(otp)) {
            return "Invalid OTP";
        }

        return "OTP verified successfully";
    }

    public String resetPassword(String email, String otp, String newPassword) {

        String storedOtp = otpStorage.get(email);

        if (storedOtp == null) {
            return "OTP not found. Please request again.";
        }

        if (!storedOtp.equals(otp)) {
            return "Invalid OTP";
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        otpStorage.remove(email);

        return "Password reset successfully";
    }
}