package com.finsight.controller;

import com.finsight.entity.Notification;
import com.finsight.entity.User;
import com.finsight.repository.NotificationRepository;
import com.finsight.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(NotificationRepository notificationRepository,
                                  UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{email}")
    public List<Notification> getNotifications(@PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @GetMapping("/unread-count/{email}")
    public Map<String, Long> getUnreadCount(@PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        long count = notificationRepository.countByUserAndStatus(user, "UNREAD");

        return Map.of("count", count);
    }

    @PutMapping("/read/{id}")
    public String markAsRead(@PathVariable Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setStatus("READ");

        notificationRepository.save(notification);

        return "Notification marked as read";
    }

    @PutMapping("/read-all/{email}")
    public String markAllAsRead(@PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        List<Notification> notifications =
                notificationRepository.findByUserOrderByCreatedAtDesc(user);

        for (Notification n : notifications) {
            n.setStatus("READ");
        }

        notificationRepository.saveAll(notifications);

        return "All notifications marked as read";
    }

    @DeleteMapping("/{id}")
    public String deleteNotification(@PathVariable Long id) {

        notificationRepository.deleteById(id);

        return "Notification deleted";
    }
}