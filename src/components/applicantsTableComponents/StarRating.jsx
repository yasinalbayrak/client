import React from 'react';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Link from '@mui/material/Link';

const StarRating = () => {
  const randomStars = 5;

  return (
    <>
      <Typography>
        {[...Array(5)].map((_, index) => (
          index < randomStars ? (
            <StarIcon key={index} style={{ color: "#F4CE14" }} />
          ) : (
            <StarBorderIcon key={index} style={{ color: "#F4CE14" }} />
          )
        ))}
      </Typography>
      <Typography>
        <Link
          variant="body2"
          underline="always"
          color="primary"
          href="#"
          style={{ fontSize: '0.8rem', lineHeight: '1.2' }}
        >
          See Reviews
        </Link>
      </Typography>
    </>
  );
};

export default StarRating;
