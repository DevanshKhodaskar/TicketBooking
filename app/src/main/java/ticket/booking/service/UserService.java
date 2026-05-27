package ticket.booking.service;

import ticket.booking.entities.User;
import ticket.booking.repository.UserRepository;
import ticket.booking.util.UserServiceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User signup(String name, String password) throws Exception {
        Optional<User> existingUser = userRepository.findByName(name);
        if (existingUser.isPresent()) {
            throw new Exception("User already exists");
        }

        String userId = UUID.randomUUID().toString();
        String hashedPassword = UserServiceUtil.hashPassword(password);
        
        User user = User.builder()
                .userId(userId)
                .name(name)
                .password(password)
                .hashedPassword(hashedPassword)
                .build();

        return userRepository.save(user);
    }

    public String login(String name, String password) throws Exception {
        Optional<User> user = userRepository.findByName(name);
        if (user.isEmpty()) {
            throw new Exception("User not found");
        }

        if (!UserServiceUtil.checkPassword(password, user.get().getHashedPassword())) {
            throw new Exception("Invalid password");
        }

        // TODO: Implement JWT token generation
        return "jwt-token-" + user.get().getUserId();
    }

    public User getUserById(String userId) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new Exception("User not found");
        }
        return user.get();
    }

    public User getUserByName(String name) throws Exception {
        Optional<User> user = userRepository.findByName(name);
        if (user.isEmpty()) {
            throw new Exception("User not found");
        }
        return user.get();
    }
}
