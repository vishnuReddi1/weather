package com.Weather.Weatherly;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setEmail(request.getEmail());
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public User loginUser(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .filter(user -> {
                    boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
                    if (!matches) {
                        System.out.println("Password mismatch for user: " + request.getEmail());
                    }
                    return matches;
                })
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }
}
