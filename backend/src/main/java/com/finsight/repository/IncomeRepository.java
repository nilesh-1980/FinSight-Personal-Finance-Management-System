package com.finsight.repository;

import com.finsight.entity.Income;
import com.finsight.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUser(User user);
}