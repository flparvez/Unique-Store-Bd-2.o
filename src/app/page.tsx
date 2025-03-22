import AdminCategoryForm from "@/components/CategoryForm";
import CategoryList from "@/components/CategoryList";

export default function Home() {

  
  return (
    <div>
      <h2 className="text-2xl text-red-700">Next Js Landing Page</h2>
      <AdminCategoryForm />

      <h2>Category</h2>

      <CategoryList />
    </div>
  );
}
