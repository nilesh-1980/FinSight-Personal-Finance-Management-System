package com.finsight.repository;

import com.finsight.entity.Budget;
import com.finsight.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUser(User user);
}