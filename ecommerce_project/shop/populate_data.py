import os
import django
from django.utils.text import slugify

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from .models import Category, Product

def populate_data():
    # Categories with local image URLs
    categories_data = [
        {'name': 'Electronics', 'slug': 'electronics', 'image_url': '/images/electronics.jpg'},
        {'name': 'Clothing', 'slug': 'clothing', 'image_url': '/images/clothing.jpg'},
        {'name': 'Books', 'slug': 'books', 'image_url': '/images/books.jpg'},
        {'name': 'Home & Garden', 'slug': 'home-garden', 'image_url': '/images/home and garden.jpg'},
        {'name': 'Sports & Outdoors', 'slug': 'sports-outdoors', 'image_url': '/images/sports.jpg'},
        {'name': 'Beauty & Personal Care', 'slug': 'beauty-personal-care', 'image_url': '/images/beauty.jpg'},
        {'name': 'Toys & Games', 'slug': 'toys-games', 'image_url': '/images/toys and images.jpg'},
        {'name': 'Automotive', 'slug': 'automotive', 'image_url': '/images/automotive.jpg'},
         {'name': 'Fashion', 'slug': 'fashion', 'image_url': '/images/fashion.jpg'},
    ]

    for cat_data in categories_data:
        Category.objects.update_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name'], 'image_url': cat_data['image_url']}
        )

    # Products
    products_data = [
        # Electronics
        {'category_slug': 'electronics', 'name': 'Wireless Bluetooth Headphones', 'description': 'High-quality wireless headphones with noise cancellation and long battery life.', 'price': 99.99, 'stock': 50},
        {'category_slug': 'electronics', 'name': 'Smartphone 128GB', 'description': 'Latest smartphone with advanced camera and fast processor.', 'price': 699.99, 'stock': 30},
        {'category_slug': 'electronics', 'name': '4K LED TV 55 Inch', 'description': 'Ultra HD TV with smart features and vibrant display.', 'price': 499.99, 'stock': 20},
        {'category_slug': 'electronics', 'name': 'Gaming Laptop', 'description': 'Powerful laptop for gaming with high-end graphics card.', 'price': 1299.99, 'stock': 15},
        {'category_slug': 'electronics', 'name': 'Smart Watch', 'description': 'Fitness tracking smartwatch with heart rate monitor.', 'price': 249.99, 'stock': 40},

        # Clothing
        {'category_slug': 'clothing', 'name': 'Cotton T-Shirt', 'description': 'Comfortable cotton t-shirt available in various colors.', 'price': 19.99, 'stock': 100},
        {'category_slug': 'clothing', 'name': 'Denim Jeans', 'description': 'Classic denim jeans with perfect fit.', 'price': 49.99, 'stock': 80},
        {'category_slug': 'clothing', 'name': 'Winter Jacket', 'description': 'Warm winter jacket for cold weather.', 'price': 89.99, 'stock': 60},
        {'category_slug': 'clothing', 'name': 'Running Shoes', 'description': 'Lightweight running shoes for athletes.', 'price': 79.99, 'stock': 70},
        {'category_slug': 'clothing', 'name': 'Summer Dress', 'description': 'Elegant summer dress perfect for outings.', 'price': 39.99, 'stock': 90},

        # Books
        {'category_slug': 'books', 'name': 'Python Programming Book', 'description': 'Comprehensive guide to Python programming.', 'price': 29.99, 'stock': 200},
        {'category_slug': 'books', 'name': 'Fiction Novel', 'description': 'Bestselling fiction novel with engaging storyline.', 'price': 14.99, 'stock': 150},
        {'category_slug': 'books', 'name': 'Cookbook', 'description': 'Delicious recipes for home cooking.', 'price': 24.99, 'stock': 120},
        {'category_slug': 'books', 'name': 'Biography', 'description': 'Inspiring biography of a famous personality.', 'price': 19.99, 'stock': 100},
        {'category_slug': 'books', 'name': 'Science Textbook', 'description': 'Detailed textbook on advanced science topics.', 'price': 49.99, 'stock': 80},

        # Home & Garden
        {'category_slug': 'home-garden', 'name': 'Garden Hose', 'description': 'Durable garden hose for watering plants.', 'price': 24.99, 'stock': 150},
        {'category_slug': 'home-garden', 'name': 'Indoor Plant', 'description': 'Beautiful indoor plant to decorate your home.', 'price': 15.99, 'stock': 200},
        {'category_slug': 'home-garden', 'name': 'Lawn Mower', 'description': 'Electric lawn mower for easy maintenance.', 'price': 199.99, 'stock': 25},
        {'category_slug': 'home-garden', 'name': 'Patio Furniture Set', 'description': 'Comfortable outdoor furniture for your patio.', 'price': 299.99, 'stock': 10},
        {'category_slug': 'home-garden', 'name': 'Grill', 'description': 'Charcoal grill for backyard barbecues.', 'price': 149.99, 'stock': 30},

        # Sports & Outdoors
        {'category_slug': 'sports-outdoors', 'name': 'Yoga Mat', 'description': 'Non-slip yoga mat for fitness routines.', 'price': 29.99, 'stock': 100},
        {'category_slug': 'sports-outdoors', 'name': 'Camping Tent', 'description': 'Waterproof tent for outdoor camping.', 'price': 89.99, 'stock': 50},
        {'category_slug': 'sports-outdoors', 'name': 'Bicycle', 'description': 'Mountain bike for adventurous rides.', 'price': 399.99, 'stock': 20},
        {'category_slug': 'sports-outdoors', 'name': 'Dumbbells Set', 'description': 'Adjustable dumbbells for home workouts.', 'price': 79.99, 'stock': 60},
        {'category_slug': 'sports-outdoors', 'name': 'Fishing Rod', 'description': 'Professional fishing rod for anglers.', 'price': 59.99, 'stock': 40},

        # Beauty & Personal Care
        {'category_slug': 'beauty-personal-care', 'name': 'Shampoo', 'description': 'Nourishing shampoo for healthy hair.', 'price': 9.99, 'stock': 300},
        {'category_slug': 'beauty-personal-care', 'name': 'Face Cream', 'description': 'Moisturizing face cream for daily use.', 'price': 19.99, 'stock': 150},
        {'category_slug': 'beauty-personal-care', 'name': 'Perfume', 'description': 'Elegant perfume with long-lasting fragrance.', 'price': 49.99, 'stock': 80},
        {'category_slug': 'beauty-personal-care', 'name': 'Hair Dryer', 'description': 'Powerful hair dryer with multiple settings.', 'price': 39.99, 'stock': 70},
        {'category_slug': 'beauty-personal-care', 'name': 'Makeup Kit', 'description': 'Complete makeup kit for professionals.', 'price': 69.99, 'stock': 50},

        # Toys & Games
        {'category_slug': 'toys-games', 'name': 'Board Game', 'description': 'Fun board game for family entertainment.', 'price': 24.99, 'stock': 100},
        {'category_slug': 'toys-games', 'name': 'Action Figure', 'description': 'Collectible action figure for kids.', 'price': 14.99, 'stock': 200},
        {'category_slug': 'toys-games', 'name': 'Puzzle Set', 'description': 'Challenging puzzle set for brain training.', 'price': 19.99, 'stock': 120},
        {'category_slug': 'toys-games', 'name': 'Building Blocks', 'description': 'Creative building blocks for imaginative play.', 'price': 34.99, 'stock': 80},
        {'category_slug': 'toys-games', 'name': 'Remote Control Car', 'description': 'Exciting RC car for outdoor fun.', 'price': 49.99, 'stock': 60},

        # Automotive
        {'category_slug': 'automotive', 'name': 'Car Tires', 'description': 'High-performance tires for better grip.', 'price': 149.99, 'stock': 40},
        {'category_slug': 'automotive', 'name': 'Car Wax', 'description': 'Protective wax for car shine.', 'price': 12.99, 'stock': 150},
        {'category_slug': 'automotive', 'name': 'Jump Starter', 'description': 'Portable jump starter for emergencies.', 'price': 79.99, 'stock': 30},
        {'category_slug': 'automotive', 'name': 'Car Seat Cover', 'description': 'Comfortable seat covers for your vehicle.', 'price': 39.99, 'stock': 70},
        {'category_slug': 'automotive', 'name': 'GPS Navigator', 'description': 'Advanced GPS for accurate navigation.', 'price': 99.99, 'stock': 25},
    ]

    for prod_data in products_data:
        category = Category.objects.get(slug=prod_data['category_slug'])
        Product.objects.update_or_create(
            name=prod_data['name'],
            category=category,
            defaults={
                'description': prod_data['description'],
                'price': prod_data['price'],
                'stock': prod_data['stock'],
                'image_url': category.image_url,
                'available': True,
            }
        )

if __name__ == '__main__':
    populate_data()
    print("Data populated successfully!")
