import mongoose ,{Schema} from "mongoose";

const categorySchema = new Schema({
    category: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);

const createCategoryByDefault = async () => {
    try {
        const categories = await Category.find();
        if (categories.length === 0) {
            await Category.create({ category: 'poetry' });
            await Category.create({ category: 'personal' });
            await Category.create({ category: 'sports' });
            await Category.create({ category: 'nature' });
            console.log('Categories created successfully.');
        }
    } catch (error) {
        console.error('Error while creating categories:', error);
    }
};

createCategoryByDefault();
export {Category}
