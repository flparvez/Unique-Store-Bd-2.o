import { model, models, Schema } from "mongoose";

export interface ICategory {
    _id: string;
    name: string;
    description: string;
    image: string;
    slug: string;
}

const categorySchema = new Schema<ICategory>({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
       
    },
    image: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
},
{
    timestamps: true
})

// if change name than update slug
categorySchema.pre('save', function (next) {
    this.slug = this.name.toLowerCase().replace(/ /g, '-');
    next();
});


const Category = models?.Category || model<ICategory>("Category", categorySchema);

export default Category;