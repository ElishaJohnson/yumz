package com.elishajohnson.yumz.repository;

import com.elishajohnson.yumz.domain.CuisineType;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the CuisineType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CuisineTypeRepository extends JpaRepository<CuisineType, Long> {

}
