package com.finsight.controller;

import com.finsight.entity.Budget;
import com.finsight.entity.Expense;
import com.finsight.entity.SavingsGoal;
import com.finsight.entity.User;
import com.finsight.repository.BudgetRepository;
import com.finsight.repository.ExpenseRepository;
import com.finsight.repository.IncomeRepository;
import com.finsight.repository.SavingsGoalRepository;
import com.finsight.repository.UserRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/report")
@CrossOrigin("*")
public class ReportController {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;

    public ReportController(UserRepository userRepository,
                            IncomeRepository incomeRepository,
                            ExpenseRepository expenseRepository,
                            BudgetRepository budgetRepository,
                            SavingsGoalRepository savingsGoalRepository) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.savingsGoalRepository = savingsGoalRepository;
    }

    @GetMapping("/{email}")
    public ResponseEntity<byte[]> generatePdf(@PathVariable String email) throws Exception {

        User user = userRepository.findByEmail(email).get();

        double totalIncome = incomeRepository.findByUser(user)
                .stream()
                .mapToDouble(i -> i.getAmount())
                .sum();

        List<Expense> expenses = expenseRepository.findByUser(user);

        double totalExpense = expenses.stream()
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

        Map<String, Double> categorySummary = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));

        List<SavingsGoal> goals = savingsGoalRepository.findByUser(user);

        ByteArrayOutputStream output = new ByteArrayOutputStream();

        Document document = new Document();
        PdfWriter.getInstance(document, output);

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22);
        Font headingFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        document.add(new Paragraph("FinSight Financial Report", titleFont));
        document.add(new Paragraph("Generated Personal Finance Summary", normalFont));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("User Details", headingFont));
        document.add(new Paragraph("Name: " + user.getName(), normalFont));
        document.add(new Paragraph("Email: " + user.getEmail(), normalFont));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("Financial Summary", headingFont));
        document.add(new Paragraph("Total Income: Rs. " + totalIncome, normalFont));
        document.add(new Paragraph("Total Expense: Rs. " + totalExpense, normalFont));
        document.add(new Paragraph("Total Savings: Rs. " + savings, normalFont));
        document.add(new Paragraph("Monthly Budget: Rs. " + budget, normalFont));
        document.add(new Paragraph("Remaining Budget: Rs. " + remainingBudget, normalFont));
        document.add(new Paragraph("Budget Used: " + String.format("%.2f", budgetUsedPercent) + "%", normalFont));
        document.add(new Paragraph("Savings Rate: " + String.format("%.2f", savingsPercent) + "%", normalFont));
        document.add(new Paragraph(" "));

        document.add(new Paragraph("Category Wise Expense Summary", headingFont));

        if (categorySummary.isEmpty()) {
            document.add(new Paragraph("No expenses added yet.", normalFont));
        } else {
            for (Map.Entry<String, Double> entry : categorySummary.entrySet()) {
                document.add(new Paragraph(entry.getKey() + ": Rs. " + entry.getValue(), normalFont));
            }
        }

        document.add(new Paragraph(" "));

        document.add(new Paragraph("Savings Goals", headingFont));

        if (goals.isEmpty()) {
            document.add(new Paragraph("No savings goals added yet.", normalFont));
        } else {
            for (SavingsGoal goal : goals) {

                double progress = 0;

                if (goal.getTargetAmount() > 0) {
                    progress = (goal.getSavedAmount() / goal.getTargetAmount()) * 100;
                }

                document.add(new Paragraph("Goal: " + goal.getGoalName(), normalFont));
                document.add(new Paragraph("Target Amount: Rs. " + goal.getTargetAmount(), normalFont));
                document.add(new Paragraph("Saved Amount: Rs. " + goal.getSavedAmount(), normalFont));
                document.add(new Paragraph("Deadline: " + goal.getDeadline(), normalFont));
                document.add(new Paragraph("Progress: " + String.format("%.2f", progress) + "% Completed", normalFont));
                document.add(new Paragraph(" "));
            }
        }

        document.close();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=finsight-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(output.toByteArray());
    }
}