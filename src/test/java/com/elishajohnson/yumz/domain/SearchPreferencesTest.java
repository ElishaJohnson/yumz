package com.elishajohnson.yumz.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.elishajohnson.yumz.web.rest.TestUtil;

public class SearchPreferencesTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SearchPreferences.class);
        SearchPreferences searchPreferences1 = new SearchPreferences();
        searchPreferences1.setId(1L);
        SearchPreferences searchPreferences2 = new SearchPreferences();
        searchPreferences2.setId(searchPreferences1.getId());
        assertThat(searchPreferences1).isEqualTo(searchPreferences2);
        searchPreferences2.setId(2L);
        assertThat(searchPreferences1).isNotEqualTo(searchPreferences2);
        searchPreferences1.setId(null);
        assertThat(searchPreferences1).isNotEqualTo(searchPreferences2);
    }
}
