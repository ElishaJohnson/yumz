package com.elishajohnson.yumz.web.rest;

import com.elishajohnson.yumz.domain.CuisineType;
import com.elishajohnson.yumz.repository.CuisineTypeRepository;
import com.elishajohnson.yumz.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.elishajohnson.yumz.domain.CuisineType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CuisineTypeResource {

    private final Logger log = LoggerFactory.getLogger(CuisineTypeResource.class);

    private static final String ENTITY_NAME = "cuisineType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CuisineTypeRepository cuisineTypeRepository;

    public CuisineTypeResource(CuisineTypeRepository cuisineTypeRepository) {
        this.cuisineTypeRepository = cuisineTypeRepository;
    }

    /**
     * {@code POST  /cuisine-types} : Create a new cuisineType.
     *
     * @param cuisineType the cuisineType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cuisineType, or with status {@code 400 (Bad Request)} if the cuisineType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cuisine-types")
    public ResponseEntity<CuisineType> createCuisineType(@Valid @RequestBody CuisineType cuisineType) throws URISyntaxException {
        log.debug("REST request to save CuisineType : {}", cuisineType);
        if (cuisineType.getId() != null) {
            throw new BadRequestAlertException("A new cuisineType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CuisineType result = cuisineTypeRepository.save(cuisineType);
        return ResponseEntity.created(new URI("/api/cuisine-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cuisine-types} : Updates an existing cuisineType.
     *
     * @param cuisineType the cuisineType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cuisineType,
     * or with status {@code 400 (Bad Request)} if the cuisineType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cuisineType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cuisine-types")
    public ResponseEntity<CuisineType> updateCuisineType(@Valid @RequestBody CuisineType cuisineType) throws URISyntaxException {
        log.debug("REST request to update CuisineType : {}", cuisineType);
        if (cuisineType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CuisineType result = cuisineTypeRepository.save(cuisineType);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cuisineType.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /cuisine-types} : get all the cuisineTypes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cuisineTypes in body.
     */
    @GetMapping("/cuisine-types")
    public ResponseEntity<List<CuisineType>> getAllCuisineTypes(Pageable pageable) {
        log.debug("REST request to get a page of CuisineTypes");
        Page<CuisineType> page = cuisineTypeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /cuisine-types/:id} : get the "id" cuisineType.
     *
     * @param id the id of the cuisineType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cuisineType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cuisine-types/{id}")
    public ResponseEntity<CuisineType> getCuisineType(@PathVariable Long id) {
        log.debug("REST request to get CuisineType : {}", id);
        Optional<CuisineType> cuisineType = cuisineTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cuisineType);
    }

    /**
     * {@code DELETE  /cuisine-types/:id} : delete the "id" cuisineType.
     *
     * @param id the id of the cuisineType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cuisine-types/{id}")
    public ResponseEntity<Void> deleteCuisineType(@PathVariable Long id) {
        log.debug("REST request to delete CuisineType : {}", id);
        cuisineTypeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
