package com.finsight.controller;

import com.finsight.dto.ForgotPasswordRequest;
import com.finsight.dto.ResetPasswordRequest;
import com.finsight.dto.VerifyOtpRequest;
import com.finsight.service.ForgotPasswordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forgot-password")
@CrossOrigin("*")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    public ForgotPasswordController(ForgotPasswordService forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody ForgotPasswordRequest request) {

    	return forgotPasswordService.sendOtp(request.getEmail());
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody VerifyOtpRequest request) {

        return forgotPasswordService.verifyOtp(request.email, request.otp);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {

        return forgotPasswordService.resetPassword(
                request.email,
                request.otp,
                request.newPassword
        );
    }
}