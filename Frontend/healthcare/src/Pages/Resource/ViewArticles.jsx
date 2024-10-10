import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HomePageContainer = styled.div`
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const BackgroundImageContainer = styled.div`
  background-image: url('https://arrivein.com/wp-content/uploads/2021/02/Blog-Banner-Navigating-the-healthcare-system-in-Canada.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  height: 600px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white; /* Text color */
  text-align: center;
  z-index: 2; /* Ensure it's above the background */

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Dark overlay */
    z-index: 1;
  }
`;

const TextOverlay = styled.div`
  font-size: 2.5rem;
  z-index: 2;
  position: relative;
  font-weight: bold;
  margin-bottom: 10px; /* Adjust margin for spacing */
`;

const DescriptionOverlay = styled.div`
  font-size: 1.2rem;
  z-index: 2;
  position: relative;
  padding: 0 20px;
  margin-top: 10px;
  max-width: 600px;
`;

const AppointmentButton = styled.button`
  background-color: #28a745; /* Green background */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 24px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 20px;
  z-index: 2;
  position: relative;

  &:hover {
    background-color: #218838; /* Darker green on hover */
  }
`;

const ArticlesSection = styled.div`
  padding: 50px 20px;
  background-color: #fff;
  text-align: center;
`;

const ArticlesHeader = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  font-family: 'cursive';
`;

const CategoryContainer = styled.div`
  margin-bottom: 50px;
  padding: 0 20px;
`;

const CategoryHeader = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 29px;
`;

const ArticleCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
`;

const ArticleCardImage = styled.img`
  width: 100%;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
`;

const CardTitle = styled.h3`
  margin: 15px 0;
  font-size: 1.5rem;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #666;
`;

const HomePage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3002/resources/get-resources');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  // Function to group articles by category
  const groupArticlesByCategory = () => {
    return articles.reduce((acc, article) => {
      const { category } = article;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(article);
      return acc;
    }, {});
  };

  const groupedArticles = groupArticlesByCategory();

  return (
    <>
      <HomePageContainer>
      <BackgroundImageContainer>
        <TextOverlay  style={{marginTop:'300px'}}>
            Find the Good Life
            <br />
            With Good Health.
        </TextOverlay>
        <DescriptionOverlay>
            Stay informed by reading our latest articles on nutrition, mental health, and disease prevention. Knowledge is power, and keeping yourself educated on health-related topics can greatly enhance your well-being and help you make informed decisions about your health.
        </DescriptionOverlay>
        </BackgroundImageContainer>

        {/* Articles Section */}
        <ArticlesSection>
          <ArticlesHeader style={{fontFamily:'cursive', color:'blue'}}>Latest Articles</ArticlesHeader>

          {Object.keys(groupedArticles).map((category) => (
            <CategoryContainer key={category}>
              <CategoryHeader style={{fontFamily:'cursive', color:'orchid'}}>{category}</CategoryHeader>
              <CardsContainer>
                {groupedArticles[category].map((article) => (
                  <ArticleCard key={article._id}>
                    <ArticleCardImage src={article.image} alt={article.title} />
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>{article.content.substring(0, 100)}...</CardDescription>
                    <Link to={`/view-articles/${article._id}`}>
                      <AppointmentButton>Read More</AppointmentButton>
                    </Link>
                  </ArticleCard>
                ))}
              </CardsContainer>
            </CategoryContainer>
          ))}
        </ArticlesSection>
      </HomePageContainer>
    </>
  );
};

export default HomePage;
