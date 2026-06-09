package com.finsight.repository;

import com.finsight.entity.SavingsGoal;
import com.finsight.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {

    List<SavingsGoal> findByUser(User user);
}