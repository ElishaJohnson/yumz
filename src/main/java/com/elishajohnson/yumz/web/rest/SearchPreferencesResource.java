package com.elishajohnson.yumz.web.rest;

import com.elishajohnson.yumz.domain.SearchPreferences;
import com.elishajohnson.yumz.repository.SearchPreferencesRepository;
import com.elishajohnson.yumz.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.elishajohnson.yumz.domain.SearchPreferences}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SearchPreferencesResource {

    private final Logger log = LoggerFactory.getLogger(SearchPreferencesResource.class);

    private static final String ENTITY_NAME = "searchPreferences";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SearchPreferencesRepository searchPreferencesRepository;

    public SearchPreferencesResource(SearchPreferencesRepository searchPreferencesRepository) {
        this.searchPreferencesRepository = searchPreferencesRepository;
    }

    /**
     * {@code POST  /search-preferences} : Create a new searchPreferences.
     *
     * @param searchPreferences the searchPreferences to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new searchPreferences, or with status {@code 400 (Bad Request)} if the searchPreferences has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/search-preferences")
    public ResponseEntity<SearchPreferences> createSearchPreferences(@Valid @RequestBody SearchPreferences searchPreferences) throws URISyntaxException {
        log.debug("REST request to save SearchPreferences : {}", searchPreferences);
        if (searchPreferences.getId() != null) {
            throw new BadRequestAlertException("A new searchPreferences cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SearchPreferences result = searchPreferencesRepository.save(searchPreferences);
        return ResponseEntity.created(new URI("/api/search-preferences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /search-preferences} : Updates an existing searchPreferences.
     *
     * @param searchPreferences the searchPreferences to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated searchPreferences,
     * or with status {@code 400 (Bad Request)} if the searchPreferences is not valid,
     * or with status {@code 500 (Internal Server Error)} if the searchPreferences couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/search-preferences")
    public ResponseEntity<SearchPreferences> updateSearchPreferences(@Valid @RequestBody SearchPreferences searchPreferences) throws URISyntaxException {
        log.debug("REST request to update SearchPreferences : {}", searchPreferences);
        if (searchPreferences.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SearchPreferences result = searchPreferencesRepository.save(searchPreferences);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, searchPreferences.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /search-preferences} : get all the searchPreferences.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of searchPreferences in body.
     */
    @GetMapping("/search-preferences")
    public List<SearchPreferences> getAllSearchPreferences() {
        log.debug("REST request to get all SearchPreferences");
        return searchPreferencesRepository.findAll();
    }

    /**
     * {@code GET  /search-preferences/:id} : get the "id" searchPreferences.
     *
     * @param id the id of the searchPreferences to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the searchPreferences, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/search-preferences/{id}")
    public ResponseEntity<SearchPreferences> getSearchPreferences(@PathVariable Long id) {
        log.debug("REST request to get SearchPreferences : {}", id);
        Optional<SearchPreferences> searchPreferences = searchPreferencesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(searchPreferences);
    }

    /**
     * {@code DELETE  /search-preferences/:id} : delete the "id" searchPreferences.
     *
     * @param id the id of the searchPreferences to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/search-preferences/{id}")
    public ResponseEntity<Void> deleteSearchPreferences(@PathVariable Long id) {
        log.debug("REST request to delete SearchPreferences : {}", id);
        searchPreferencesRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
