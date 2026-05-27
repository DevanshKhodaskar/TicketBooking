package ticket.booking.controller;

import ticket.booking.dto.AuthResponse;
import ticket.booking.entities.User;
import ticket.booking.dto.UserResponse;
import ticket.booking.dto.LoginRequest;
import ticket.booking.dto.SignupRequest;
import ticket.booking.dto.ApiResponse;
import ticket.booking.service.JwtService;
import ticket.booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@RequestBody SignupRequest request) {
        try {
            User user = userService.signup(request.getName(), request.getPassword());
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "User registered successfully",
                    buildAuthResponse(user)
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getName(), request.getPassword());
            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", buildAuthResponse(user)));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Unauthorized", null));
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "User retrieved", toUserResponse(user)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable String userId, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Unauthorized", null));
        }

        if (!currentUser.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, "You can only access your own profile", null));
        }

        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "User retrieved", toUserResponse(user)));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "User not found", null));
        }
    }

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .token(jwtService.generateToken(user))
                .user(toUserResponse(user))
                .build();
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
