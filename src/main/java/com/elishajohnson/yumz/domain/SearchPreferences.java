package com.elishajohnson.yumz.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A SearchPreferences.
 */
@Entity
@Table(name = "search_preferences")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class SearchPreferences implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getFood() {
        return food;
    }

    public SearchPreferences food(Integer food) {
        this.food = food;
        return this;
    }

    public void setFood(Integer food) {
        this.food = food;
    }

    public Integer getHospitality() {
        return hospitality;
    }

    public SearchPreferences hospitality(Integer hospitality) {
        this.hospitality = hospitality;
        return this;
    }

    public void setHospitality(Integer hospitality) {
        this.hospitality = hospitality;
    }

    public Integer getAtmosphere() {
        return atmosphere;
    }

    public SearchPreferences atmosphere(Integer atmosphere) {
        this.atmosphere = atmosphere;
        return this;
    }

    public void setAtmosphere(Integer atmosphere) {
        this.atmosphere = atmosphere;
    }

    public User getUser() {
        return user;
    }

    public SearchPreferences user(User user) {
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
        if (!(o instanceof SearchPreferences)) {
            return false;
        }
        return id != null && id.equals(((SearchPreferences) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "SearchPreferences{" +
            "id=" + getId() +
            ", food=" + getFood() +
            ", hospitality=" + getHospitality() +
            ", atmosphere=" + getAtmosphere() +
            ", user='" + getUser() +"'" +
            "}";
    }
}
