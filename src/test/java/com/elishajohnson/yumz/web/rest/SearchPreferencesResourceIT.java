package com.elishajohnson.yumz.web.rest;

import com.elishajohnson.yumz.YumzApp;
import com.elishajohnson.yumz.domain.SearchPreferences;
import com.elishajohnson.yumz.repository.SearchPreferencesRepository;
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
 * Integration tests for the {@link SearchPreferencesResource} REST controller.
 */
@SpringBootTest(classes = YumzApp.class)
public class SearchPreferencesResourceIT {

    private static final Integer DEFAULT_FOOD = 5;
    private static final Integer UPDATED_FOOD = 4;

    private static final Integer DEFAULT_HOSPITALITY = 5;
    private static final Integer UPDATED_HOSPITALITY = 4;

    private static final Integer DEFAULT_ATMOSPHERE = 5;
    private static final Integer UPDATED_ATMOSPHERE = 4;

    @Autowired
    private SearchPreferencesRepository searchPreferencesRepository;

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

    private MockMvc restSearchPreferencesMockMvc;

    private SearchPreferences searchPreferences;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SearchPreferencesResource searchPreferencesResource = new SearchPreferencesResource(searchPreferencesRepository);
        this.restSearchPreferencesMockMvc = MockMvcBuilders.standaloneSetup(searchPreferencesResource)
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
    public static SearchPreferences createEntity(EntityManager em) {
        SearchPreferences searchPreferences = new SearchPreferences()
            .food(DEFAULT_FOOD)
            .hospitality(DEFAULT_HOSPITALITY)
            .atmosphere(DEFAULT_ATMOSPHERE);
        return searchPreferences;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SearchPreferences createUpdatedEntity(EntityManager em) {
        SearchPreferences searchPreferences = new SearchPreferences()
            .food(UPDATED_FOOD)
            .hospitality(UPDATED_HOSPITALITY)
            .atmosphere(UPDATED_ATMOSPHERE);
        return searchPreferences;
    }

    @BeforeEach
    public void initTest() {
        searchPreferences = createEntity(em);
    }

    @Test
    @Transactional
    public void createSearchPreferences() throws Exception {
        int databaseSizeBeforeCreate = searchPreferencesRepository.findAll().size();

        // Create the SearchPreferences
        restSearchPreferencesMockMvc.perform(post("/api/search-preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(searchPreferences)))
            .andExpect(status().isCreated());

        // Validate the SearchPreferences in the database
        List<SearchPreferences> searchPreferencesList = searchPreferencesRepository.findAll();
        assertThat(searchPreferencesList).hasSize(databaseSizeBeforeCreate + 1);
        SearchPreferences testSearchPreferences = searchPreferencesList.get(searchPreferencesList.size() - 1);
        assertThat(testSearchPreferences.getFood()).isEqualTo(DEFAULT_FOOD);
        assertThat(testSearchPreferences.getHospitality()).isEqualTo(DEFAULT_HOSPITALITY);
        assertThat(testSearchPreferences.getAtmosphere()).isEqualTo(DEFAULT_ATMOSPHERE);
    }

    @Test
    @Transactional
    public void createSearchPreferencesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = searchPreferencesRepository.findAll().size();

        // Create the SearchPreferences with an existing ID
        searchPreferences.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSearchPreferencesMockMvc.perform(post("/api/search-preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(searchPreferences)))
            .andExpect(status().isBadRequest());

        // Validate the SearchPreferences in the database
        List<SearchPreferences> searchPreferencesList = searchPreferencesRepository.findAll();
        assertThat(searchPreferencesList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkFoodIsRequired() throws Exception {
        int databaseSizeBeforeTest = searchPreferencesRepository.findAll().size();
        // set the field null
        searchPreferences.setFood(null);

        // Create the SearchPreferences, which fails.

        restSearchPreferencesMockMvc.perform(post("/api/search-preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(searchPreferences)))
            .andExpect(status().isBadRequest());

        List<SearchPreferences> searchPreferencesList = searchPreferencesRepository.findAll();
        assertThat(searchPreferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkHospitalityIsRequired() throws Exception {
        int databaseSizeBeforeTest = searchPreferencesRepository.findAll().size();
        // set the field null
        searchPreferences.setHospitality(null);

        // Create the SearchPreferences, which fails.

        restSearchPreferencesMockMvc.perform(post("/api/search-preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(searchPreferences)))
            .andExpect(status().isBadRequest());

        List<SearchPreferences> searchPreferencesList = searchPreferencesRepository.findAll();
        assertThat(searchPreferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAtmosphereIsRequired() throws Exception {
        int databaseSizeBeforeTest = searchPreferencesRepository.findAll().size();
        // set the field null
        searchPreferences.setAtmosphere(null);

        // Create the SearchPreferences, which fails.

        restSearchPreferencesMockMvc.perform(post("/api/search-preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(searchPreferences)))
            .andExpect(status().isBadRequest());

        List<SearchPreferences> searchPreferencesList = searchPreferencesRepository.findAll();
        assertThat(searchPreferencesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSearchPreferences() throws Exception {
        // Initialize the database
        searchPreferencesRepository.saveAndFlush(searchPreferences);

        // Get all the searchPreferencesList
        restSearchPreferencesMockMvc.perform(get("/api/search-preferences?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(searchPreferences.getId().intValue())))
            .andExpect(jsonPath("$.[*].food").value(hasItem(DEFAULT_FOOD)))
            .andExpect(jsonPath("$.[*].hospitality").value(hasItem(DEFAULT_HOSPITALITY)))
            .andExpect(jsonPath("$.[*].atmosphere").value(hasItem(DEFAULT_ATMOSPHERE)));
    }
    
    @Test
    @Transactional
    public void getSearchPreferences() throws Exception {
        // Initialize the database
        searchPreferencesRepository.saveAndFlush(searchPreferences);

        // Get the searchPreferences
        restSearchPreferencesMockMvc.perform(get("/api/search-preferences/{id}", searchPreferences.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(searchPreferences.getId().intValue()))
            .andExpect(jsonPath("$.food").value(DEFAULT_FOOD))
            .andExpect(jsonPath("$.hospitality").value(DEFAULT_HOSPITALITY))
            .andExpect(jsonPath("$.atmosphere").value(DEFAULT_ATMOSPHERE));
    }

    @Test
    @Transactional
    public void getNonExistingSearchPreferences() throws Exception {
        // Get the searchPreferences
        restSearchPreferencesMockMvc.perform(get("/api/search-preferences/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSearchPreferences() throws Exception {
        // Initialize the database
        searchPreferencesRepository.saveAndFlush(searchPreferences);

        int databaseSizeBeforeUpdate = searchPreferencesRepository.findAll().size();

        // Update the searchPreferences
        SearchPreferences updatedSearchPreferences = searchPreferencesRepository.findById(searchPreferences.getId()).get();
        // Disconnect from session so that the updates on updatedSearchPreferences are not directly saved in db
        em.detach(updatedSearchPreferences);
        updatedSearchPreferences
            .food(UPDATED_FOOD)
            .hospitality(UPDATED_HOSPITALITY)
            .atmosphere(UPDATED_ATMOSPHERE);

        restSearchPreferencesMockMvc.perform(put("/api/search-preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSearchPreferences)))
            .andExpect(status().isOk());

        // Validate the SearchPreferences in the database
        List<SearchPreferences> searchPreferencesList = searchPreferencesRepository.findAll();
        assertThat(searchPreferencesList).hasSize(databaseSizeBeforeUpdate);
        SearchPreferences testSearchPreferences = searchPreferencesList.get(searchPreferencesList.size() - 1);
        assertThat(testSearchPreferences.getFood()).isEqualTo(UPDATED_FOOD);
        assertThat(testSearchPreferences.getHospitality()).isEqualTo(UPDATED_HOSPITALITY);
        assertThat(testSearchPreferences.getAtmosphere()).isEqualTo(UPDATED_ATMOSPHERE);
    }

    @Test
    @Transactional
    public void updateNonExistingSearchPreferences() throws Exception {
        int databaseSizeBeforeUpdate = searchPreferencesRepository.findAll().size();

        // Create the SearchPreferences

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSearchPreferencesMockMvc.perform(put("/api/search-preferences")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(searchPreferences)))
            .andExpect(status().isBadRequest());

        // Validate the SearchPreferences in the database
        List<SearchPreferences> searchPreferencesList = searchPreferencesRepository.findAll();
        assertThat(searchPreferencesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSearchPreferences() throws Exception {
        // Initialize the database
        searchPreferencesRepository.saveAndFlush(searchPreferences);

        int databaseSizeBeforeDelete = searchPreferencesRepository.findAll().size();

        // Delete the searchPreferences
        restSearchPreferencesMockMvc.perform(delete("/api/search-preferences/{id}", searchPreferences.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SearchPreferences> searchPreferencesList = searchPreferencesRepository.findAll();
        assertThat(searchPreferencesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
