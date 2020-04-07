package com.elishajohnson.yumz.repository;

import com.elishajohnson.yumz.domain.SearchPreferences;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the SearchPreferences entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SearchPreferencesRepository extends JpaRepository<SearchPreferences, Long> {

}
