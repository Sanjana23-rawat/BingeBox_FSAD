import React from "react";
import styled from "styled-components";
import CardSlider from "./CardSlider";

export default function Slider({ movies }) {
  // Ensure movies is an array and not undefined
  if (!Array.isArray(movies)) {
    return <p>No movies available.</p>;
  }

  const getMoviesFromRange = (from, to) => {
    // Check if movies is defined and not null
    if (movies) {
      // Use slice method if movies is defined
      return movies.slice(from, to);
    } else {
      // Handle the case where movies is undefined or null
      return [];
    }
  };

  return (
    <Container>
      <CardSlider data={getMoviesFromRange(0, 10)} title="Trending Now" />
      <CardSlider data={getMoviesFromRange(10, 20)} title="New Releases" />
      <CardSlider
        data={getMoviesFromRange(20, 30)}
        title="Blockbuster Movies"
      />
      <CardSlider
        data={getMoviesFromRange(30, 40)}
        title="Popular on Netflix"
      />
      <CardSlider data={getMoviesFromRange(40, 50)} title="Action Movies" />
      <CardSlider data={getMoviesFromRange(50, 60)} title="Epics" />
    </Container>
  );
}

const Container = styled.div``;
