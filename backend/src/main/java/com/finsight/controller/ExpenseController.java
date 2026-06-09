package com.finsight.controller;
import java.util.Map;
import com.finsight.entity.Expense;
import com.finsight.entity.User;
import com.finsight.repository.ExpenseRepository;
import com.finsight.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import com.finsight.entity.Budget;
import com.finsight.entity.Notification;
import com.finsight.repository.BudgetRepository;
import com.finsight.repository.NotificationRepository;
import java.util.List;



@RestController
@RequestMapping("/api/expense")
@CrossOrigin("*")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final NotificationRepository notificationRepository;

    public ExpenseController(ExpenseRepository expenseRepository,
            UserRepository userRepository,
            BudgetRepository budgetRepository,
            NotificationRepository notificationRepository) {
this.expenseRepository = expenseRepository;
this.userRepository = userRepository;
this.budgetRepository = budgetRepository;
this.notificationRepository = notificationRepository;
}

    @PostMapping("/{email}")
    public Expense addExpense(@PathVariable String email, @RequestBody Expense expense) {

        User user = userRepository.findByEmail(email).get();
        expense.setUser(user);

        Expense savedExpense = expenseRepository.save(expense);

        checkBudgetAndNotify(user);

        return savedExpense;
    }

    @GetMapping("/{email}")
    public List<Expense> getExpense(@PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        return expenseRepository.findByUser(user);
    }
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense newExpense) {

        Expense oldExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        oldExpense.setAmount(newExpense.getAmount());
        oldExpense.setCategory(newExpense.getCategory());
        oldExpense.setDate(newExpense.getDate());
        oldExpense.setDescription(newExpense.getDescription());

        Expense updatedExpense = expenseRepository.save(oldExpense);

        checkBudgetAndNotify(oldExpense.getUser());

        return updatedExpense;
    }
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id) {

        expenseRepository.deleteById(id);

        return "Expense Deleted Successfully";
    }
    @GetMapping("/category-summary/{email}")
    public Map<String, Double> getExpenseCategorySummary(@PathVariable String email) {

        User user = userRepository.findByEmail(email).get();

        List<Expense> expenses = expenseRepository.findByUser(user);

        Map<String, Double> summary = expenses.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        Expense::getCategory,
                        java.util.stream.Collectors.summingDouble(Expense::getAmount)
                ));

        return summary;
    }
    private void checkBudgetAndNotify(User user) {

        List<Budget> budgets = budgetRepository.findByUser(user);

        if (budgets.isEmpty()) {
            return;
        }

        double budget = budgets.get(budgets.size() - 1).getAmount();

        double totalExpense = expenseRepository.findByUser(user)
                .stream()
                .mapToDouble(e -> e.getAmount())
                .sum();

        double usedPercent = (totalExpense / budget) * 100;

        Notification notification = new Notification();
        notification.setUser(user);

        if (usedPercent >= 100) {
            notification.setMessage("🚨 Budget Limit Exceeded! You have spent ₹" + totalExpense);
            notificationRepository.save(notification);
        } else if (usedPercent >= 80) {
            notification.setMessage("⚠️ You have used " + String.format("%.2f", usedPercent) + "% of your budget.");
            notificationRepository.save(notification);
        }
    }
}