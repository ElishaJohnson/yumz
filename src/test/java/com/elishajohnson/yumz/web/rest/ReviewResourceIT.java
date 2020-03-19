package com.elishajohnson.yumz.web.rest;

import com.elishajohnson.yumz.YumzApp;
import com.elishajohnson.yumz.domain.Review;
import com.elishajohnson.yumz.repository.ReviewRepository;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.elishajohnson.yumz.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ReviewResource} REST controller.
 */
@SpringBootTest(classes = YumzApp.class)
public class ReviewResourceIT {

    private static final String DEFAULT_REVIEW_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_REVIEW_TEXT = "BBBBBBBBBB";

    private static final Integer DEFAULT_FOOD = 5;
    private static final Integer UPDATED_FOOD = 4;

    private static final Integer DEFAULT_HOSPITALITY = 5;
    private static final Integer UPDATED_HOSPITALITY = 4;

    private static final Integer DEFAULT_ATMOSPHERE = 5;
    private static final Integer UPDATED_ATMOSPHERE = 4;

    private static final Instant DEFAULT_REVIEW_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_REVIEW_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private ReviewRepository reviewRepository;

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

    private MockMvc restReviewMockMvc;

    private Review review;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ReviewResource reviewResource = new ReviewResource(reviewRepository);
        this.restReviewMockMvc = MockMvcBuilders.standaloneSetup(reviewResource)
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
    public static Review createEntity(EntityManager em) {
        Review review = new Review()
            .reviewText(DEFAULT_REVIEW_TEXT)
            .food(DEFAULT_FOOD)
            .hospitality(DEFAULT_HOSPITALITY)
            .atmosphere(DEFAULT_ATMOSPHERE)
            .reviewDate(DEFAULT_REVIEW_DATE);
        return review;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Review createUpdatedEntity(EntityManager em) {
        Review review = new Review()
            .reviewText(UPDATED_REVIEW_TEXT)
            .food(UPDATED_FOOD)
            .hospitality(UPDATED_HOSPITALITY)
            .atmosphere(UPDATED_ATMOSPHERE)
            .reviewDate(UPDATED_REVIEW_DATE);
        return review;
    }

    @BeforeEach
    public void initTest() {
        review = createEntity(em);
    }

    @Test
    @Transactional
    public void createReview() throws Exception {
        int databaseSizeBeforeCreate = reviewRepository.findAll().size();

        // Create the Review
        restReviewMockMvc.perform(post("/api/reviews")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(review)))
            .andExpect(status().isCreated());

        // Validate the Review in the database
        List<Review> reviewList = reviewRepository.findAll();
        assertThat(reviewList).hasSize(databaseSizeBeforeCreate + 1);
        Review testReview = reviewList.get(reviewList.size() - 1);
        assertThat(testReview.getReviewText()).isEqualTo(DEFAULT_REVIEW_TEXT);
        assertThat(testReview.getFood()).isEqualTo(DEFAULT_FOOD);
        assertThat(testReview.getHospitality()).isEqualTo(DEFAULT_HOSPITALITY);
        assertThat(testReview.getAtmosphere()).isEqualTo(DEFAULT_ATMOSPHERE);
        assertThat(testReview.getReviewDate()).isEqualTo(DEFAULT_REVIEW_DATE);
    }

    @Test
    @Transactional
    public void createReviewWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = reviewRepository.findAll().size();

        // Create the Review with an existing ID
        review.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restReviewMockMvc.perform(post("/api/reviews")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(review)))
            .andExpect(status().isBadRequest());

        // Validate the Review in the database
        List<Review> reviewList = reviewRepository.findAll();
        assertThat(reviewList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkFoodIsRequired() throws Exception {
        int databaseSizeBeforeTest = reviewRepository.findAll().size();
        // set the field null
        review.setFood(null);

        // Create the Review, which fails.

        restReviewMockMvc.perform(post("/api/reviews")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(review)))
            .andExpect(status().isBadRequest());

        List<Review> reviewList = reviewRepository.findAll();
        assertThat(reviewList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkHospitalityIsRequired() throws Exception {
        int databaseSizeBeforeTest = reviewRepository.findAll().size();
        // set the field null
        review.setHospitality(null);

        // Create the Review, which fails.

        restReviewMockMvc.perform(post("/api/reviews")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(review)))
            .andExpect(status().isBadRequest());

        List<Review> reviewList = reviewRepository.findAll();
        assertThat(reviewList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAtmosphereIsRequired() throws Exception {
        int databaseSizeBeforeTest = reviewRepository.findAll().size();
        // set the field null
        review.setAtmosphere(null);

        // Create the Review, which fails.

        restReviewMockMvc.perform(post("/api/reviews")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(review)))
            .andExpect(status().isBadRequest());

        List<Review> reviewList = reviewRepository.findAll();
        assertThat(reviewList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllReviews() throws Exception {
        // Initialize the database
        reviewRepository.saveAndFlush(review);

        // Get all the reviewList
        restReviewMockMvc.perform(get("/api/reviews?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(review.getId().intValue())))
            .andExpect(jsonPath("$.[*].reviewText").value(hasItem(DEFAULT_REVIEW_TEXT)))
            .andExpect(jsonPath("$.[*].food").value(hasItem(DEFAULT_FOOD)))
            .andExpect(jsonPath("$.[*].hospitality").value(hasItem(DEFAULT_HOSPITALITY)))
            .andExpect(jsonPath("$.[*].atmosphere").value(hasItem(DEFAULT_ATMOSPHERE)))
            .andExpect(jsonPath("$.[*].reviewDate").value(hasItem(DEFAULT_REVIEW_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getReview() throws Exception {
        // Initialize the database
        reviewRepository.saveAndFlush(review);

        // Get the review
        restReviewMockMvc.perform(get("/api/reviews/{id}", review.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(review.getId().intValue()))
            .andExpect(jsonPath("$.reviewText").value(DEFAULT_REVIEW_TEXT))
            .andExpect(jsonPath("$.food").value(DEFAULT_FOOD))
            .andExpect(jsonPath("$.hospitality").value(DEFAULT_HOSPITALITY))
            .andExpect(jsonPath("$.atmosphere").value(DEFAULT_ATMOSPHERE))
            .andExpect(jsonPath("$.reviewDate").value(DEFAULT_REVIEW_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingReview() throws Exception {
        // Get the review
        restReviewMockMvc.perform(get("/api/reviews/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateReview() throws Exception {
        // Initialize the database
        reviewRepository.saveAndFlush(review);

        int databaseSizeBeforeUpdate = reviewRepository.findAll().size();

        // Update the review
        Review updatedReview = reviewRepository.findById(review.getId()).get();
        // Disconnect from session so that the updates on updatedReview are not directly saved in db
        em.detach(updatedReview);
        updatedReview
            .reviewText(UPDATED_REVIEW_TEXT)
            .food(UPDATED_FOOD)
            .hospitality(UPDATED_HOSPITALITY)
            .atmosphere(UPDATED_ATMOSPHERE)
            .reviewDate(UPDATED_REVIEW_DATE);

        restReviewMockMvc.perform(put("/api/reviews")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedReview)))
            .andExpect(status().isOk());

        // Validate the Review in the database
        List<Review> reviewList = reviewRepository.findAll();
        assertThat(reviewList).hasSize(databaseSizeBeforeUpdate);
        Review testReview = reviewList.get(reviewList.size() - 1);
        assertThat(testReview.getReviewText()).isEqualTo(UPDATED_REVIEW_TEXT);
        assertThat(testReview.getFood()).isEqualTo(UPDATED_FOOD);
        assertThat(testReview.getHospitality()).isEqualTo(UPDATED_HOSPITALITY);
        assertThat(testReview.getAtmosphere()).isEqualTo(UPDATED_ATMOSPHERE);
        assertThat(testReview.getReviewDate()).isEqualTo(UPDATED_REVIEW_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingReview() throws Exception {
        int databaseSizeBeforeUpdate = reviewRepository.findAll().size();

        // Create the Review

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReviewMockMvc.perform(put("/api/reviews")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(review)))
            .andExpect(status().isBadRequest());

        // Validate the Review in the database
        List<Review> reviewList = reviewRepository.findAll();
        assertThat(reviewList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteReview() throws Exception {
        // Initialize the database
        reviewRepository.saveAndFlush(review);

        int databaseSizeBeforeDelete = reviewRepository.findAll().size();

        // Delete the review
        restReviewMockMvc.perform(delete("/api/reviews/{id}", review.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Review> reviewList = reviewRepository.findAll();
        assertThat(reviewList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
