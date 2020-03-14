package com.elishajohnson.yumz.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Restaurant.
 */
@Entity
@Table(name = "restaurant")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Restaurant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @NotNull
    @Size(min = 3, max = 100)
    @Column(name = "location", length = 100, nullable = false)
    private String location;

    @NotNull
    @Size(min = 7, max = 20)
    @Column(name = "phone", length = 20, nullable = false)
    private String phone;

    @NotNull
    @Size(min = 5, max = 100)
    @Column(name = "website", length = 100, nullable = false)
    private String website;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "restaurant_cuisine_type",
               joinColumns = @JoinColumn(name = "restaurant_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "cuisine_type_id", referencedColumnName = "id"))
    private Set<CuisineType> cuisineTypes = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("restaurants")
    private Review review;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Restaurant name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public Restaurant location(String location) {
        this.location = location;
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPhone() {
        return phone;
    }

    public Restaurant phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getWebsite() {
        return website;
    }

    public Restaurant website(String website) {
        this.website = website;
        return this;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Set<CuisineType> getCuisineTypes() {
        return cuisineTypes;
    }

    public Restaurant cuisineTypes(Set<CuisineType> cuisineTypes) {
        this.cuisineTypes = cuisineTypes;
        return this;
    }

    public Restaurant addCuisineType(CuisineType cuisineType) {
        this.cuisineTypes.add(cuisineType);
        cuisineType.getRestaurants().add(this);
        return this;
    }

    public Restaurant removeCuisineType(CuisineType cuisineType) {
        this.cuisineTypes.remove(cuisineType);
        cuisineType.getRestaurants().remove(this);
        return this;
    }

    public void setCuisineTypes(Set<CuisineType> cuisineTypes) {
        this.cuisineTypes = cuisineTypes;
    }

    public Review getReview() {
        return review;
    }

    public Restaurant review(Review review) {
        this.review = review;
        return this;
    }

    public void setReview(Review review) {
        this.review = review;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Restaurant)) {
            return false;
        }
        return id != null && id.equals(((Restaurant) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Restaurant{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", location='" + getLocation() + "'" +
            ", phone='" + getPhone() + "'" +
            ", website='" + getWebsite() + "'" +
            "}";
    }
}
