package com.finsight.controller;

import com.finsight.entity.User;
import com.finsight.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final NotificationRepository notificationRepository;

    public AdminController(UserRepository userRepository,
                           IncomeRepository incomeRepository,
                           ExpenseRepository expenseRepository,
                           BudgetRepository budgetRepository,
                           SavingsGoalRepository savingsGoalRepository,
                           NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.savingsGoalRepository = savingsGoalRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> getAdminSummary() {

        double totalIncome = incomeRepository.findAll()
                .stream()
                .mapToDouble(i -> i.getAmount())
                .sum();

        double totalExpense = expenseRepository.findAll()
                .stream()
                .mapToDouble(e -> e.getAmount())
                .sum();

        double totalSavings = totalIncome - totalExpense;

        return Map.of(
                "totalUsers", userRepository.count(),
                "totalIncome", totalIncome,
                "totalExpense", totalExpense,
                "totalSavings", totalSavings,
                "totalBudgets", budgetRepository.count(),
                "totalGoals", savingsGoalRepository.count(),
                "totalNotifications", notificationRepository.count()
        );
    }

    @GetMapping("/users")
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
}