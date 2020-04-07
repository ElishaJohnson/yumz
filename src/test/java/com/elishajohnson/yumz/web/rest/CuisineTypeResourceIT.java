package com.elishajohnson.yumz.web.rest;

import com.elishajohnson.yumz.YumzApp;
import com.elishajohnson.yumz.domain.CuisineType;
import com.elishajohnson.yumz.repository.CuisineTypeRepository;
import com.elishajohnson.yumz.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.elishajohnson.yumz.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link CuisineTypeResource} REST controller.
 */
@SpringBootTest(classes = YumzApp.class)
public class CuisineTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CuisineTypeRepository cuisineTypeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restCuisineTypeMockMvc;

    private CuisineType cuisineType;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CuisineTypeResource cuisineTypeResource = new CuisineTypeResource(cuisineTypeRepository);
        this.restCuisineTypeMockMvc = MockMvcBuilders.standaloneSetup(cuisineTypeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CuisineType createEntity(EntityManager em) {
        CuisineType cuisineType = new CuisineType()
            .name(DEFAULT_NAME);
        return cuisineType;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CuisineType createUpdatedEntity(EntityManager em) {
        CuisineType cuisineType = new CuisineType()
            .name(UPDATED_NAME);
        return cuisineType;
    }

    @BeforeEach
    public void initTest() {
        cuisineType = createEntity(em);
    }

    @Test
    @Transactional
    public void createCuisineType() throws Exception {
        int databaseSizeBeforeCreate = cuisineTypeRepository.findAll().size();

        // Create the CuisineType
        restCuisineTypeMockMvc.perform(post("/api/cuisine-types")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(cuisineType)))
            .andExpect(status().isCreated());

        // Validate the CuisineType in the database
        List<CuisineType> cuisineTypeList = cuisineTypeRepository.findAll();
        assertThat(cuisineTypeList).hasSize(databaseSizeBeforeCreate + 1);
        CuisineType testCuisineType = cuisineTypeList.get(cuisineTypeList.size() - 1);
        assertThat(testCuisineType.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createCuisineTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cuisineTypeRepository.findAll().size();

        // Create the CuisineType with an existing ID
        cuisineType.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCuisineTypeMockMvc.perform(post("/api/cuisine-types")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(cuisineType)))
            .andExpect(status().isBadRequest());

        // Validate the CuisineType in the database
        List<CuisineType> cuisineTypeList = cuisineTypeRepository.findAll();
        assertThat(cuisineTypeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = cuisineTypeRepository.findAll().size();
        // set the field null
        cuisineType.setName(null);

        // Create the CuisineType, which fails.

        restCuisineTypeMockMvc.perform(post("/api/cuisine-types")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(cuisineType)))
            .andExpect(status().isBadRequest());

        List<CuisineType> cuisineTypeList = cuisineTypeRepository.findAll();
        assertThat(cuisineTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCuisineTypes() throws Exception {
        // Initialize the database
        cuisineTypeRepository.saveAndFlush(cuisineType);

        // Get all the cuisineTypeList
        restCuisineTypeMockMvc.perform(get("/api/cuisine-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cuisineType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }
    
    @Test
    @Transactional
    public void getCuisineType() throws Exception {
        // Initialize the database
        cuisineTypeRepository.saveAndFlush(cuisineType);

        // Get the cuisineType
        restCuisineTypeMockMvc.perform(get("/api/cuisine-types/{id}", cuisineType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cuisineType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    public void getNonExistingCuisineType() throws Exception {
        // Get the cuisineType
        restCuisineTypeMockMvc.perform(get("/api/cuisine-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCuisineType() throws Exception {
        // Initialize the database
        cuisineTypeRepository.saveAndFlush(cuisineType);

        int databaseSizeBeforeUpdate = cuisineTypeRepository.findAll().size();

        // Update the cuisineType
        CuisineType updatedCuisineType = cuisineTypeRepository.findById(cuisineType.getId()).get();
        // Disconnect from session so that the updates on updatedCuisineType are not directly saved in db
        em.detach(updatedCuisineType);
        updatedCuisineType
            .name(UPDATED_NAME);

        restCuisineTypeMockMvc.perform(put("/api/cuisine-types")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedCuisineType)))
            .andExpect(status().isOk());

        // Validate the CuisineType in the database
        List<CuisineType> cuisineTypeList = cuisineTypeRepository.findAll();
        assertThat(cuisineTypeList).hasSize(databaseSizeBeforeUpdate);
        CuisineType testCuisineType = cuisineTypeList.get(cuisineTypeList.size() - 1);
        assertThat(testCuisineType.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingCuisineType() throws Exception {
        int databaseSizeBeforeUpdate = cuisineTypeRepository.findAll().size();

        // Create the CuisineType

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCuisineTypeMockMvc.perform(put("/api/cuisine-types")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(cuisineType)))
            .andExpect(status().isBadRequest());

        // Validate the CuisineType in the database
        List<CuisineType> cuisineTypeList = cuisineTypeRepository.findAll();
        assertThat(cuisineTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCuisineType() throws Exception {
        // Initialize the database
        cuisineTypeRepository.saveAndFlush(cuisineType);

        int databaseSizeBeforeDelete = cuisineTypeRepository.findAll().size();

        // Delete the cuisineType
        restCuisineTypeMockMvc.perform(delete("/api/cuisine-types/{id}", cuisineType.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CuisineType> cuisineTypeList = cuisineTypeRepository.findAll();
        assertThat(cuisineTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
