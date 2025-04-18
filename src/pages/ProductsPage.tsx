import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import ProductPreview from "@/components/ProductPreview";
import SearchAndFilterBar from "@/components/products/SearchAndFilterBar";
import ProductTable from "@/components/products/ProductTable";
import { Product } from "@/types/product";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ✅ Fetch products from Square API
  const fetchProducts = async () => {
    try {
      const response = await fetch("https://backend-square.onrender.com/api/catalog/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer EAAAl7wuu6ayAloKJ0uxnDTt6QX2-Sa8W7tmGSuMcADB09D4CNQgyrgBa19QG5hC`,
          "Content-Type": "application/json"
        },
      });

      console.log(response,"mmmmmmmmmmmmmmmmmmmmmm");

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();

      // ✅ Map Square API response to Product type
      const mappedProducts = data.objects
        .filter((item: any) => item.type === "ITEM")
        .map((item: any) => ({
          id: item.id,
          name: item.item_data.name,
          sku: item.id, // No direct SKU in API, using ID as SKU
          image: item.item_data.ecom_image_uris?.[0] || "/placeholder.svg",
          price: item.item_data.variations[0]?.item_variation_data?.price_money?.amount / 100 || 0,
          inventory: 10, // Example value (Square API doesn't return inventory directly)
          status: item.item_data.ecom_available ? "Active" : "Inactive",
          platforms: item.item_data.channels || [],
        }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product listings across all platforms.</p>
        </div>
        <Button asChild>
          <Link to="/upload" className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </Button>
      </div>

      {/* Product Table */}
      <Card>
        <CardContent className="p-6">
          <SearchAndFilterBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <ProductTable 
            products={filteredProducts}
            onSelectProduct={setSelectedProduct}
          />
        </CardContent>
      </Card>

      {/* Product Preview */}
      <ProductPreview 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ProductsPage;






// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { Plus } from "lucide-react";
// import ProductPreview from "@/components/ProductPreview";
// import SearchAndFilterBar from "@/components/products/SearchAndFilterBar";
// import ProductTable from "@/components/products/ProductTable";
// import { Product } from "@/types/product";

// // Mock data
// const mockProducts = [
//   {
//     id: '1',
//     name: 'Handmade Ceramic Mug',
//     sku: 'MUG001',
//     image: '/placeholder.svg',
//     price: 24.99,
//     inventory: 15,
//     status: 'Active',
//     platforms: ['etsy', 'facebook', 'square']
//   },
//   {
//     id: '2',
//     name: 'Vintage Style Wall Clock',
//     sku: 'CLK002',
//     image: '/placeholder.svg',
//     price: 39.99,
//     inventory: 8,
//     status: 'Active',
//     platforms: ['tiktok', 'square']
//   },
//   {
//     id: '3',
//     name: 'Organic Cotton T-shirt',
//     sku: 'TSH003',
//     image: '/placeholder.svg',
//     price: 19.99,
//     inventory: 32,
//     status: 'Active',
//     platforms: ['etsy', 'square', 'facebook']
//   },
//   {
//     id: '4',
//     name: 'Leather Wallet',
//     sku: 'WAL004',
//     image: '/placeholder.svg',
//     price: 49.99,
//     inventory: 12,
//     status: 'Processing',
//     platforms: ['tiktok', 'etsy']
//   },
//   {
//     id: '5',
//     name: 'Handcrafted Wooden Bowl',
//     sku: 'BWL005',
//     image: '/placeholder.svg',
//     price: 34.99,
//     inventory: 7,
//     status: 'Active',
//     platforms: ['etsy', 'square']
//   },
//   {
//     id: '6',
//     name: 'Macrame Plant Hanger',
//     sku: 'PLT006',
//     image: '/placeholder.svg',
//     price: 18.99,
//     inventory: 21,
//     status: 'Draft',
//     platforms: []
//   },
//   {
//     id: '7',
//     name: 'Hand-poured Scented Candle',
//     sku: 'CND007',
//     image: '/placeholder.svg',
//     price: 16.99,
//     inventory: 45,
//     status: 'Active',
//     platforms: ['etsy', 'facebook']
//   }
// ];

// const ProductsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [products] = useState<Product[]>(mockProducts);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
//   const filteredProducts = products.filter(product => 
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.sku.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold">Products</h1>
//           <p className="text-muted-foreground">Manage your product listings across all platforms.</p>
//         </div>
//         <Button asChild>
//           <Link to="/upload" className="flex items-center gap-2">
//             <Plus size={16} />
//             <span>Add Product</span>
//           </Link>
//         </Button>
//       </div>
      
//       <Card>
//         <CardContent className="p-6">
//           <SearchAndFilterBar 
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//           />
          
//           <ProductTable 
//             products={filteredProducts}
//             onSelectProduct={setSelectedProduct}
//           />
//         </CardContent>
//       </Card>

//       <ProductPreview 
//         product={selectedProduct}
//         isOpen={!!selectedProduct}
//         onClose={() => setSelectedProduct(null)}
//       />
//     </div>
//   );
// };

// export default ProductsPage;
