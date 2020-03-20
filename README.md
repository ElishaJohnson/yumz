# yumz

This application was generated using JHipster 6.7.1, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v6.7.1](https://www.jhipster.tech/documentation-archive/v6.7.1).

## Overview

This program will provide a searchable database of restaurant ratings and reviews. Users will rate different aspects of a restaurant (e.g. quality of food, service, atmosphere) on a scale of 1 to 5 stars, and will be able to view & sort results based on the average star rating in any or all of the available categories.

The thing that will set this apart from other rating systems will be personalized customization a user's search results. Users will be able to select the priority of each category (or turn any of them off if desired), and the database will return weighted overall average ratings based on the user's settings. For example, if a restaurant has 5 stars for quality, 4 stars for service, and 3 stars for atmosphere, the default overall rating would be 4 stars. However, if the user prioritizes quality at 100%, service at 60%, and atmosphere at 10%, the restaurant's overall rating would show up as 4.5 stars in the user's personalized search. If the user selected 0% for quality, 100% for service, and 100% for atmosphere, the same restaurant would have a 3.5 star overall rating. This will allow the user to tailor their dining experience to their immediate individual needs.
Features

    - A database of users, with the ability to create an account, log in & out, and create restaurant ratings & reviews
    - A searchable database of restaurants, each connected to a set of reviews & ratings
    - A database of restaurant reviews and ratings, allowing restaurants to be sorted by their average star ratings
    - A "weighted average" feature which will allow users to customize their search results based on personal priority

## Technologies

    - JHipster
    - Java / Spring
    - JavaScript / React
    - MySQL
