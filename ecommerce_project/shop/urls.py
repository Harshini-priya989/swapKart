from django.contrib import admin
from django.urls import path
from .views import (
    hello, home,
    CategoryList, CategoryProducts, ProductList, ProductDetail, AddToCart,
    Cart, UpdateCart, Checkout, MyOrders, OrderDetail,
    category_list, category_products,
    product_list, product_detail,
    cart, update_cart, checkout, billing,
    signup, login_view, logout_page,
    signup_page, login_page,
    my_orders, order_detail,
    admin_dashboard, admin_product_list, admin_add_product,
    admin_edit_product, admin_delete_product, admin_order_list, admin_order_detail
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # API endpoints
    path('api/categories/', CategoryList.as_view(), name='api_category_list'),
    path('api/category/<slug:category_slug>/', CategoryProducts.as_view(), name='api_category_products'),
    path('api/products/', ProductList.as_view(), name='api_product_list'),
    path('api/product/<int:pk>/', ProductDetail.as_view(), name='api_product_detail'),
    path('api/cart/', Cart.as_view(), name='api_cart'),
    path('api/cart/update/<int:item_id>/', UpdateCart.as_view(), name='api_update_cart'),
    path('api/checkout/', Checkout.as_view(), name='api_checkout'),
    path('api/my-orders/', MyOrders.as_view(), name='api_my_orders'),
    path('api/order/<int:order_id>/', OrderDetail.as_view(), name='api_order_detail'),
    path("api/hello/", hello),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('signup/', signup, name='signup'),

    # Homepage & Category
    path('', category_list, name='home'),
    path('category/<slug:category_slug>/', category_products, name='category_products'),

    # Product & Search
    path('products/', product_list, name='product_list'),
    path('product/<int:pk>/', product_detail, name='product_detail'),
    path('search/', product_list, name='product_list'),

    # Cart & Checkout
    path('add-to-cart/<int:product_id>/', AddToCart.as_view(), name='add_to_cart'),
    path('cart/', cart, name='cart'),
    path('cart/update/<int:item_id>/<str:action>/', update_cart, name='update_cart'),
    path('checkout/', checkout, name='checkout'),
    path('billing/', billing, name='billing'),

    # User auth
    path('signup/', signup_page, name='signup_page'),
    path('login/', login_page, name='login_page'),
    path('logout/', logout_page, name='logout_page'),

    # Orders
    path('my-orders/', my_orders, name='my_orders'),
    path('<int:order_id>/', order_detail, name='order_detail'),

    # Admin Dashboard URLs
    path('dashboard/', admin_dashboard, name='admin_dashboard'),
    path('dashboard/products/', admin_product_list, name='admin_product_list'),
    path('dashboard/product/add/', admin_add_product, name='admin_add_product'),
    path('dashboard/product/edit/<int:pk>/', admin_edit_product, name='admin_edit_product'),
    path('dashboard/product/delete/<int:pk>/', admin_delete_product, name='admin_delete_product'),
    path('dashboard/orders/', admin_order_list, name='admin_order_list'),
    path('dashboard/orders/<int:pk>/', admin_order_detail, name='admin_order_detail'),
]
