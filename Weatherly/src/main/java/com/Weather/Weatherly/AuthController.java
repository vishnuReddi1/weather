package com.Weather.Weatherly;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // allow all origins for testing
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest request) {
        try {
            User savedUser = userService.registerUser(request);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            User user = userService.loginUser(request);
            // Remove password before returning user object
            user.setPassword(null);
            System.out.println("User logged in: " + user.getEmail());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            System.out.println("Login failed: " + e.getMessage());
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
