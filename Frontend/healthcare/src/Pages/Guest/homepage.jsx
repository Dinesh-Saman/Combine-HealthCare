import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';


const HomePageContainer = styled.div`
  flex-direction: column;
  align-items: center;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const BackgroundImageContainer = styled.div`
  background-image: url('https://americanmigrainefoundation.org/wp-content/uploads/2018/12/doctor-patient.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  height: 600px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Add dark overlay */
    z-index: 1;
  }
`;

const TextOverlay = styled.div`
  color: white;
  font-size: 2.5rem;
  text-align: center;
  z-index: 2;
  position: relative;
  padding: 0 20px;
  font-weight: bold;
  margin-top: 260px;
`;

const DescriptionOverlay = styled.div`
  color: white;
  font-size: 1.2rem;
  text-align: center;
  z-index: 2;
  position: relative;
  padding: 20px;
  margin-top: 10px;
  max-width: 600px;
`;

const AppointmentButton = styled.button`
  background-color: #28a745; /* Green background */
  color: white;
  border: none;
  border-radius: 50px;
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

const ServicesSection = styled.div`
  padding: 50px 20px;
  background-color: #fff;
  text-align: center;
`;

const ServicesHeader = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
`;

const Card = styled.div`
  background-color: #f9f9f9;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 20px;
`;

const CardImage = styled.img`
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
  return (
    <>
      <HomePageContainer>
        <BackgroundImageContainer>
          <TextOverlay>
            Find the Good Life
            <br />
            With Good Health.
          </TextOverlay>
          <DescriptionOverlay>
            We are committed to providing exceptional medical services and personalized treatment to ensure the well-being of our patients. Your health journey is important to us, and we are here every step of the way.
          </DescriptionOverlay>
        </BackgroundImageContainer>

        {/* Our Services Section */}
        <ServicesSection>
          <ServicesHeader>Our Services</ServicesHeader>
          <CardsContainer>
            <Card>
              <CardImage src="https://www.metropolisindia.com/upgrade/blog/upload/2023/06/Full-body-checkup.jpg" alt="Service 1" />
              <CardTitle>General Checkup</CardTitle>
              <CardDescription>
                Comprehensive health assessments to maintain your well-being.
              </CardDescription>
            </Card>

            <Card>
              <CardImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ1o0MHdixqm1fIgyJAjBZ-XSf9z7N1upAdQ&s" alt="Service 2" />
              <CardTitle>Specialist Consultation</CardTitle>
              <CardDescription>
                Consult with experienced specialists for all your health concerns.
              </CardDescription>
            </Card>

            <Card>
              <CardImage src="https://www.828urgentcare.com/Sites/B35EE094-1733-4F45-AE3A-184C3FAB532F/images/wp-content/uploads/2018/03/Onsite-Laboratory-Investigations-and-Screening-Services.jpg" alt="Service 3" />
              <CardTitle>Laboratory Services</CardTitle>
              <CardDescription>
                Advanced diagnostic tests with quick and accurate results.
              </CardDescription>
            </Card>

            <Card>
              <CardImage src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/201801/India_Today_-_Lead-image_0.jpeg" alt="Service 4" />
              <CardTitle>Emergency Care</CardTitle>
              <CardDescription>
                Immediate medical care for urgent health needs.
              </CardDescription>
            </Card>

            <Card>
              <CardImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlRRo2YihC0q40mpS8kolBixjPvliTP9lnGA&s" alt="Service 5" />
              <CardTitle>Dental Care</CardTitle>
              <CardDescription>
                Complete oral healthcare, from regular cleanings to surgeries.
              </CardDescription>
            </Card>

            <Card>
              <CardImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvLgaeThX4FMrzxZEieA6TsEBF_fgbnqbKvA&s" alt="Service 6" />
              <CardTitle>Pharmacy Services</CardTitle>
              <CardDescription>
                On-site pharmacy providing all essential medications.
              </CardDescription>
            </Card>

            <Card>
              <CardImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRes0Mc6IT0g0bj7skOJ9w9llw--cOZtdMWSw&s" alt="Service 7" />
              <CardTitle>Physiotherapy</CardTitle>
              <CardDescription>
                Physical therapy treatments to help with recovery and mobility.
              </CardDescription>
            </Card>

            <Card>
              <CardImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy7_uQ6au_ctaMogd-6TOs2he6EXQ1ur3BgA&s" alt="Service 8" />
              <CardTitle>Mental Health</CardTitle>
              <CardDescription>
                Dedicated mental health professionals to support emotional well-being.
              </CardDescription>
            </Card>
          </CardsContainer>
        </ServicesSection>
      </HomePageContainer>
    </>
  );
};

export default HomePage;
