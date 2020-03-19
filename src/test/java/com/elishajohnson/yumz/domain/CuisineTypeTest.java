package com.elishajohnson.yumz.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.elishajohnson.yumz.web.rest.TestUtil;

public class CuisineTypeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CuisineType.class);
        CuisineType cuisineType1 = new CuisineType();
        cuisineType1.setId(1L);
        CuisineType cuisineType2 = new CuisineType();
        cuisineType2.setId(cuisineType1.getId());
        assertThat(cuisineType1).isEqualTo(cuisineType2);
        cuisineType2.setId(2L);
        assertThat(cuisineType1).isNotEqualTo(cuisineType2);
        cuisineType1.setId(null);
        assertThat(cuisineType1).isNotEqualTo(cuisineType2);
    }
}
