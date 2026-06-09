package com.finsight.controller;

import com.finsight.entity.Budget;
import com.finsight.entity.User;
import com.finsight.repository.BudgetRepository;
import com.finsight.repository.ExpenseRepository;
import com.finsight.repository.IncomeRepository;
import com.finsight.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    public DashboardController(UserRepository userRepository,
                               IncomeRepository incomeRepository,
                               ExpenseRepository expenseRepository,
                               BudgetRepository budgetRepository) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    @GetMapping("/{email}")
    public Map<String, Object> getDashboard(@PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        double totalIncome = incomeRepository.findByUser(user)
                .stream()
                .mapToDouble(i -> i.getAmount())
                .sum();

        double totalExpense = expenseRepository.findByUser(user)
                .stream()
                .mapToDouble(e -> e.getAmount())
                .sum();

        double savings = totalIncome - totalExpense;

        List<Budget> budgets = budgetRepository.findByUser(user);

        double budget = 0;

        if (!budgets.isEmpty()) {
            budget = budgets.get(budgets.size() - 1).getAmount();
        }

        double remainingBudget = budget - totalExpense;

        double budgetUsedPercent = 0;

        if (budget > 0) {
            budgetUsedPercent = (totalExpense / budget) * 100;
        }

        double savingsPercent = 0;

        if (totalIncome > 0) {
            savingsPercent = (savings / totalIncome) * 100;
        }

        String alertMessage = "Budget not set yet";

        if (budget > 0) {
            if (budgetUsedPercent >= 100) {
                alertMessage = "🚨 Budget Exceeded! You are over your monthly limit.";
            } else if (budgetUsedPercent >= 90) {
                alertMessage = "⚠️ High Alert! You have used "
                        + String.format("%.2f", budgetUsedPercent)
                        + "% of your budget.";
            } else if (budgetUsedPercent >= 80) {
                alertMessage = "⚠️ Warning! You have used "
                        + String.format("%.2f", budgetUsedPercent)
                        + "% of your budget.";
            } else {
                alertMessage = "✅ Budget is under control.";
            }
        }

        String savingsInsight;

        if (savingsPercent >= 50) {
            savingsInsight = "✅ Excellent! Your savings rate is very strong.";
        } else if (savingsPercent >= 25) {
            savingsInsight = "👍 Good! You are saving well.";
        } else if (savingsPercent >= 10) {
            savingsInsight = "⚠️ Average savings. Try to reduce unnecessary expenses.";
        } else {
            savingsInsight = "🚨 Low savings rate. You should control your spending.";
        }

        String budgetInsight;

        if (budget <= 0) {
            budgetInsight = "📌 Please set your monthly budget to get better financial advice.";
        } else if (budgetUsedPercent >= 100) {
            budgetInsight = "🚨 You crossed your budget. Stop non-essential spending.";
        } else if (budgetUsedPercent >= 90) {
            budgetInsight = "⚠️ Very high budget usage. Spend carefully.";
        } else if (budgetUsedPercent >= 80) {
            budgetInsight = "⚠️ Budget warning. You are close to your limit.";
        } else {
            budgetInsight = "✅ Your budget is under control.";
        }

        return Map.of(
                "totalIncome", totalIncome,
                "totalExpense", totalExpense,
                "savings", savings,
                "budget", budget,
                "remainingBudget", remainingBudget,
                "budgetUsedPercent", budgetUsedPercent,
                "savingsPercent", savingsPercent,
                "alertMessage", alertMessage,
                "savingsInsight", savingsInsight,
                "budgetInsight", budgetInsight
        );
    }
}