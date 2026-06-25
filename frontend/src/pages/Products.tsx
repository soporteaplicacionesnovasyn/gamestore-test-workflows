import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  averageRating?: number;
  totalRatings?: number;
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { user } = useAuth();

  // Category filtering state
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [page, category, sort, minPrice, maxPrice]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError('');
      try {
        const response = await api.products.getCategories();
        if (response.success) {
          setCategories(response.data || []);
        } else {
          setCategoriesError(response.error || 'Failed to load categories');
        }
      } catch (error) {
        setCategoriesError('Failed to load categories');
        console.error('Failed to load categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 10 };
      if (category) params.category = category;
      if (sort) params.sort = sort;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (search) params.search = search;

      const response = await api.products.getAll(params);
      if (!response.success) {
        setError(response.error || 'Failed to load products');
        setProducts([]);
        setTotalPages(1);
        return;
      }
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      setError('Failed to load products. Please try again.');
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    await addItem(productId);
    alert('Added to cart!');
  };

  const handleRate = async (productId: number, score: number) => {
    if (!user) {
      alert('Please login to rate products');
      return;
    }
    try {
      const result = await api.products.rate(productId, score);
      if (result.success) {
        setProducts(prev => prev.map(p =>
          p.id === productId
            ? { ...p, averageRating: result.data.averageRating, totalRatings: result.data.totalRatings }
            : p
        ));
      }
    } catch (error) {
      console.error('Failed to rate product', error);
    }
  };

  // Show loading state on initial load
  if (categoriesLoading) {
    return <div className="container mx-auto p-4">Loading categories...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="flex gap-4 mb-6">
        {categoriesError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {categoriesError}
          </div>
        )}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border p-2 rounded w-64"
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="border p-2 rounded"
          disabled={categoriesLoading}
        >
          <option value="">All Categories</option>
          {categoriesLoading && (
            <option disabled>Loading categories...</option>
          )}
          {categoriesError && (
            <option disabled>Failed to load categories</option>
          )}
          {!categoriesLoading && !categoriesError && categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border p-2 rounded w-64"
        />
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <select
          value={sort}
          onChange={e => { setSort(e.target.value); setPage(1); }}
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => { setMinPrice(e.target.value); setPage(1); }}
          className="border p-2 rounded w-32"
          min="0"
          step="0.01"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
          className="border p-2 rounded w-32"
          min="0"
          step="0.01"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product.id}`} className="hover:text-blue-600">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <p className="text-blue-600 font-bold mt-2">${product.price}</p>
                  <div className="mt-1">
                    <StarRating
                      value={product.averageRating ?? 0}
                      totalRatings={product.totalRatings}
                      interactive={!!user}
                      onChange={(score) => handleRate(product.id, score)}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="mt-2 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded ${page === p ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};