import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Define the fade-in keyframe animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ArticleContainer = styled.div`
  padding: 50px;
  background-color: #f4f4f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 1.5s ease-in-out; /* Apply fade-in effect */
`;

const ArticleImage = styled.img`
  width: 100%;
  max-width: 800px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const ArticleTitle = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
`;

const ArticleDetails = styled.div`
  font-size: 1rem;
  color: #666;
  margin-bottom: 30px;
  text-align: center;
`;

const ArticleAuthor = styled.span`
  margin-right: 20px;
  font-weight: bold;
`;

const ArticleCategory = styled.span`
  margin-right: 20px;
  font-style: italic;
  color: #888;
`;

const PublishDate = styled.span`
  color: #666;
`;

const ArticleContent = styled.div`
  max-width: 800px;
  font-size: 1.2rem;
  line-height: 1.6;
  text-align: justify;
`;

const SingleArticlePage = () => {
  const { id } = useParams(); // Get article ID from URL
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:3002/resources/get-resource/${id}`);
        const data = await response.json();
        setArticle(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!article) {
    return <p>Article not found.</p>;
  }

  return (
    <ArticleContainer>
      <ArticleImage src={article.image} alt={article.title} />
      <ArticleTitle>{article.title}</ArticleTitle>
      <ArticleDetails>
        <ArticleAuthor>Author: {article.author}</ArticleAuthor>
        <ArticleCategory>Category: {article.category}</ArticleCategory>
        <PublishDate>Published on: {new Date(article.publish_date).toLocaleDateString()}</PublishDate>
      </ArticleDetails>
      <ArticleContent>{article.content}</ArticleContent>
    </ArticleContainer>
  );
};

export default SingleArticlePage;
