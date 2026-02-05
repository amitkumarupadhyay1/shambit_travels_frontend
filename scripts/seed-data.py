#!/usr/bin/env python3
"""
Sample data seeding script for ShamBit backend
Run this script to populate the Django backend with sample data for testing the frontend
"""

import requests
import json

# Backend API base URL
API_BASE = "http://localhost:8000/api"

# Sample data
SAMPLE_CITIES = [
    {
        "name": "Ayodhya",
        "state": "Uttar Pradesh",
        "country": "India",
        "description": "The birthplace of Lord Rama, Ayodhya is one of the seven sacred cities in Hinduism. Experience divine spirituality at the magnificent Ram Mandir and explore ancient temples along the sacred Sarayu River.",
        "is_featured": True
    },
    {
        "name": "Varanasi",
        "state": "Uttar Pradesh", 
        "country": "India",
        "description": "One of the world's oldest continuously inhabited cities, Varanasi is the spiritual capital of India. Witness the mesmerizing Ganga Aarti and experience the eternal cycle of life and death on the sacred ghats.",
        "is_featured": True
    },
    {
        "name": "Rishikesh",
        "state": "Uttarakhand",
        "country": "India", 
        "description": "Known as the 'Yoga Capital of the World', Rishikesh offers spiritual awakening amidst the Himalayan foothills. Practice yoga, meditation, and experience the divine energy of the holy Ganges.",
        "is_featured": True
    },
    {
        "name": "Haridwar",
        "state": "Uttarakhand",
        "country": "India",
        "description": "Gateway to the gods, Haridwar is where the sacred Ganges descends from the Himalayas to the plains. Participate in the evening Ganga Aarti at Har Ki Pauri and feel the divine presence.",
        "is_featured": True
    },
    {
        "name": "Mathura",
        "state": "Uttar Pradesh",
        "country": "India",
        "description": "The birthplace of Lord Krishna, Mathura is steeped in divine love and devotion. Explore ancient temples, participate in colorful festivals, and immerse yourself in Krishna's eternal leela.",
        "is_featured": True
    },
    {
        "name": "Vrindavan",
        "state": "Uttar Pradesh", 
        "country": "India",
        "description": "The playground of Lord Krishna, Vrindavan resonates with divine love and spiritual bliss. Visit the sacred temples, participate in kirtan, and experience the eternal romance of Radha-Krishna.",
        "is_featured": True
    }
]

SAMPLE_ARTICLES = [
    {
        "title": "The Spiritual Significance of Ayodhya: A Journey Through Time",
        "slug": "spiritual-significance-ayodhya-journey-through-time",
        "content": "Ayodhya, the ancient city that holds the heart of millions of devotees worldwide, stands as a testament to India's rich spiritual heritage...",
        "excerpt": "Discover the profound spiritual significance of Ayodhya, from the magnificent Ram Mandir to the sacred Sarayu River, and understand why this ancient city continues to inspire millions of pilgrims.",
        "author": "Dr. Priya Sharma",
        "is_published": True,
        "is_featured": True
    },
    {
        "title": "Experiencing the Divine: Ganga Aarti in Varanasi",
        "slug": "experiencing-divine-ganga-aarti-varanasi", 
        "content": "As the sun sets over the ancient city of Varanasi, the ghats come alive with the mesmerizing Ganga Aarti ceremony...",
        "excerpt": "Witness the magical Ganga Aarti ceremony in Varanasi, where thousands of devotees gather each evening to honor the sacred river Ganges in a spectacular display of devotion.",
        "author": "Rajesh Kumar",
        "is_published": True,
        "is_featured": True
    },
    {
        "title": "Yoga and Meditation in Rishikesh: A Transformative Experience",
        "slug": "yoga-meditation-rishikesh-transformative-experience",
        "content": "Nestled in the foothills of the Himalayas, Rishikesh offers a unique opportunity for spiritual transformation through yoga and meditation...",
        "excerpt": "Explore how Rishikesh, the Yoga Capital of the World, offers transformative experiences through ancient practices of yoga and meditation amidst the serene Himalayan landscape.",
        "author": "Swami Ananda",
        "is_published": True,
        "is_featured": True
    }
]

SAMPLE_PACKAGES = [
    {
        "name": "Sacred Ayodhya Pilgrimage",
        "description": "A comprehensive 3-day spiritual journey through Ayodhya, including visits to Ram Mandir, Hanuman Garhi, and boat rides on the sacred Sarayu River. Experience the divine presence of Lord Rama in his birthplace.",
        "duration_days": 3,
        "base_price": 15000,
        "is_featured": True
    },
    {
        "name": "Varanasi Spiritual Immersion", 
        "description": "Dive deep into the spiritual essence of Varanasi with this 4-day package. Witness Ganga Aarti, explore ancient temples, take boat rides at sunrise, and experience the eternal city's mystical energy.",
        "duration_days": 4,
        "base_price": 18000,
        "is_featured": True
    },
    {
        "name": "Rishikesh Yoga Retreat",
        "description": "Transform your mind, body, and soul with this 7-day yoga retreat in Rishikesh. Includes daily yoga sessions, meditation, spiritual discourses, and adventure activities like river rafting.",
        "duration_days": 7, 
        "base_price": 25000,
        "is_featured": True
    }
]

def create_sample_data():
    """Create sample data in the backend"""
    
    print("🕉️  Starting ShamBit data seeding...")
    
    # Create cities
    print("\n📍 Creating sample cities...")
    city_ids = {}
    for city_data in SAMPLE_CITIES:
        try:
            response = requests.post(f"{API_BASE}/cities/", json=city_data)
            if response.status_code == 201:
                city = response.json()
                city_ids[city_data['name']] = city['id']
                print(f"   ✅ Created city: {city_data['name']}")
            else:
                print(f"   ❌ Failed to create city: {city_data['name']} - {response.status_code}")
        except Exception as e:
            print(f"   ❌ Error creating city {city_data['name']}: {e}")
    
    # Create articles
    print("\n📝 Creating sample articles...")
    for i, article_data in enumerate(SAMPLE_ARTICLES):
        try:
            # Assign city to article
            city_names = list(city_ids.keys())
            if i < len(city_names):
                article_data['city'] = city_ids[city_names[i]]
            
            response = requests.post(f"{API_BASE}/articles/", json=article_data)
            if response.status_code == 201:
                print(f"   ✅ Created article: {article_data['title']}")
            else:
                print(f"   ❌ Failed to create article: {article_data['title']} - {response.status_code}")
        except Exception as e:
            print(f"   ❌ Error creating article {article_data['title']}: {e}")
    
    # Create packages
    print("\n📦 Creating sample packages...")
    for i, package_data in enumerate(SAMPLE_PACKAGES):
        try:
            # Assign city to package
            city_names = list(city_ids.keys())
            if i < len(city_names):
                package_data['city'] = city_ids[city_names[i]]
            
            response = requests.post(f"{API_BASE}/packages/", json=package_data)
            if response.status_code == 201:
                print(f"   ✅ Created package: {package_data['name']}")
            else:
                print(f"   ❌ Failed to create package: {package_data['name']} - {response.status_code}")
        except Exception as e:
            print(f"   ❌ Error creating package {package_data['name']}: {e}")
    
    print("\n🎉 Sample data seeding completed!")
    print("🌐 You can now test the frontend at http://localhost:3000")
    print("🔧 Make sure your Django backend is running at http://localhost:8000")

if __name__ == "__main__":
    create_sample_data()