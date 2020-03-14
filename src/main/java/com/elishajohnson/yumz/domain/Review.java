package com.elishajohnson.yumz.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A Review.
 */
@Entity
@Table(name = "review")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Review implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 5000)
    @Column(name = "review_text", length = 5000)
    private String reviewText;

    @NotNull
    @Max(value = 5)
    @Column(name = "food", nullable = false)
    private Integer food;

    @NotNull
    @Max(value = 5)
    @Column(name = "hospitality", nullable = false)
    private Integer hospitality;

    @NotNull
    @Max(value = 5)
    @Column(name = "atmosphere", nullable = false)
    private Integer atmosphere;

    @Column(name = "review_date")
    private Instant reviewDate;

    @OneToMany(mappedBy = "review")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Restaurant> restaurants = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("reviews")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReviewText() {
        return reviewText;
    }

    public Review reviewText(String reviewText) {
        this.reviewText = reviewText;
        return this;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public Integer getFood() {
        return food;
    }

    public Review food(Integer food) {
        this.food = food;
        return this;
    }

    public void setFood(Integer food) {
        this.food = food;
    }

    public Integer getHospitality() {
        return hospitality;
    }

    public Review hospitality(Integer hospitality) {
        this.hospitality = hospitality;
        return this;
    }

    public void setHospitality(Integer hospitality) {
        this.hospitality = hospitality;
    }

    public Integer getAtmosphere() {
        return atmosphere;
    }

    public Review atmosphere(Integer atmosphere) {
        this.atmosphere = atmosphere;
        return this;
    }

    public void setAtmosphere(Integer atmosphere) {
        this.atmosphere = atmosphere;
    }

    public Instant getReviewDate() {
        return reviewDate;
    }

    public Review reviewDate(Instant reviewDate) {
        this.reviewDate = reviewDate;
        return this;
    }

    public void setReviewDate(Instant reviewDate) {
        this.reviewDate = reviewDate;
    }

    public Set<Restaurant> getRestaurants() {
        return restaurants;
    }

    public Review restaurants(Set<Restaurant> restaurants) {
        this.restaurants = restaurants;
        return this;
    }

    public Review addRestaurant(Restaurant restaurant) {
        this.restaurants.add(restaurant);
        restaurant.setReview(this);
        return this;
    }

    public Review removeRestaurant(Restaurant restaurant) {
        this.restaurants.remove(restaurant);
        restaurant.setReview(null);
        return this;
    }

    public void setRestaurants(Set<Restaurant> restaurants) {
        this.restaurants = restaurants;
    }

    public User getUser() {
        return user;
    }

    public Review user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Review)) {
            return false;
        }
        return id != null && id.equals(((Review) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Review{" +
            "id=" + getId() +
            ", reviewText='" + getReviewText() + "'" +
            ", food=" + getFood() +
            ", hospitality=" + getHospitality() +
            ", atmosphere=" + getAtmosphere() +
            ", reviewDate='" + getReviewDate() + "'" +
            "}";
    }
}
