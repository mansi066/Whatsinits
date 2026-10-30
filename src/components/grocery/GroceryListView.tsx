import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GroceryItem } from '../../types';
import {
  ShoppingBag,
  Check,
  Trash2,
  Plus,
  Printer,
  Copy,
  Edit2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { BackButton } from '../common/BackButton';

const CATEGORIES = [
  'Vegetables & Fruits',
  'Grains & Cereals',
  'Pulses & Legumes',
  'Dairy or alternatives',
  'Protein sources',
  'Spices & condiments',
  'Other essentials',
];

export const GroceryListView: React.FC = () => {
  const {
    groceryList,
    toggleGroceryItem,
    deleteGroceryItem,
    updateGroceryItemQuantity,
    addCustomGroceryItem,
    clearPurchasedGrocery,
  } = useApp();

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(CATEGORIES[0]);
  const [newItemCost, setNewItemCost] = useState(40);
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState('');

  const totalCost = groceryList.reduce((acc, curr) => acc + (curr.estimatedCostInr || 0), 0);
  const purchasedCount = groceryList.filter((g) => g.purchased).length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addCustomGroceryItem(newItemName.trim(), newItemCategory, Number(newItemCost) || 30);
    setNewItemName('');
  };

  const handleStartEdit = (item: GroceryItem) => {
    setEditingId(item.id);
    setEditQty(item.quantity);
  };

  const handleSaveEdit = (id: string) => {
    updateGroceryItemQuantity(id, editQty);
    setEditingId(null);
  };

  const handleCopyText = () => {
    const lines = ["WhatsInit Consolidated Grocery List:"];
    for (const cat of CATEGORIES) {
      const inCat = groceryList.filter((i) => i.category === cat);
      if (inCat.length > 0) {
        lines.push(`\n[${cat}]`);
        inCat.forEach((item) => {
          lines.push(`${item.purchased ? '✓' : '□'} ${item.name} (${item.quantity}) - ₹${item.estimatedCostInr}`);
        });
      }
    }
    lines.push(`\nEstimated Total: ₹${totalCost}`);
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Back Button Navigation */}
      <div className="flex items-center justify-between">
        <BackButton fallbackTab="mealplan" label="Back to Meal Planner" />
        <span className="text-xs text-[#77716B] font-medium hidden sm:inline-block">
          Auto-synced with weekly meals
        </span>
      </div>

      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-[#FFF0E3] text-[#F58220] px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-2 border border-[#FFAB66]/30">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pantry & Shopping Basket</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">
            Consolidated Grocery List
          </h1>
          <p className="text-xs sm:text-sm text-[#77716B] mt-1">
            Auto-merged ingredients across recipes and weekly meal plans with local Indian market price estimates.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 border border-[#252525]/15 hover:bg-white text-xs font-semibold rounded-xl text-[#252525] flex items-center space-x-1.5 transition-all shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-[#22A447]" /> : <Copy className="w-4 h-4 text-[#77716B]" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy List'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 border border-[#252525]/15 hover:bg-white text-xs font-semibold rounded-xl text-[#252525] flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#77716B]" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Card */}
      <div className="bg-gradient-to-r from-[#F58220] to-[#FFAB66] text-white rounded-2xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] text-white/90 uppercase tracking-wider font-bold">
            Estimated Weekly Shopping Budget
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            ₹{totalCost}
          </div>
          <p className="text-xs text-white/95 font-medium">
            {groceryList.length} items total • {purchasedCount} marked as purchased
          </p>
        </div>

        {purchasedCount > 0 && (
          <button
            onClick={clearPurchasedGrocery}
            className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-all shadow-xs backdrop-blur-xs self-start sm:self-auto"
          >
            Clear Purchased Items ({purchasedCount})
          </button>
        )}
      </div>

      {/* Add Custom Item Input */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#252525]/10 shadow-xs spotlight-card">
        <h4 className="text-xs font-bold text-[#252525] mb-3 uppercase tracking-wider flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
          <span>Add Custom Item to Grocery List</span>
        </h4>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <input
            type="text"
            required
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name (e.g. Organic Gur / Jaggery)"
            className="sm:col-span-2 px-3.5 py-2.5 border border-[#252525]/15 rounded-xl outline-none focus:ring-2 focus:ring-[#F58220] focus:border-[#F58220] transition-all bg-[#FFFAF5]"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="px-3 py-2.5 border border-[#252525]/15 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#F58220]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="py-2.5 bg-[#F58220] hover:bg-[#e07116] text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </form>
      </div>

      {/* Categorized Grocery List */}
      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const itemsInCategory = groceryList.filter((i) => i.category === category);
          if (itemsInCategory.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-2xl p-5 sm:p-6 border border-[#252525]/10 shadow-xs space-y-3 spotlight-card">
              <div className="flex items-center justify-between border-b border-[#252525]/8 pb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F58220]">
                  {category} ({itemsInCategory.length})
                </h3>
                <span className="text-xs text-[#77716B] font-semibold">
                  Subtotal: ₹{itemsInCategory.reduce((a, c) => a + (c.estimatedCostInr || 0), 0)}
                </span>
              </div>

              <div className="space-y-2">
                {itemsInCategory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      item.purchased
                        ? 'bg-[#FFFAF5] border-slate-200 opacity-60'
                        : 'bg-white border-[#252525]/8 hover:border-[#F58220]/40 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={item.purchased}
                        onChange={() => toggleGroceryItem(item.id)}
                        className="w-4 h-4 rounded text-[#F58220] focus:ring-[#F58220] cursor-pointer accent-[#F58220]"
                      />
                      <div>
                        <span
                          className={`text-xs font-bold block ${
                            item.purchased ? 'line-through text-[#77716B]' : 'text-[#252525]'
                          }`}
                        >
                          {item.name}
                        </span>
                        {editingId === item.id ? (
                          <div className="flex items-center space-x-1.5 mt-1.5">
                            <input
                              type="text"
                              value={editQty}
                              onChange={(e) => setEditQty(e.target.value)}
                              className="text-xs px-2.5 py-1 border border-[#F58220] rounded-lg w-32 outline-none"
                            />
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="text-[11px] bg-[#F58220] text-white px-2.5 py-1 rounded-lg font-bold hover:bg-[#e07116]"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#77716B]">{item.quantity}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono font-bold text-[#252525]">
                        ₹{item.estimatedCostInr}
                      </span>
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 text-[#77716B] hover:text-[#F58220] hover:bg-[#FFF0E3] rounded-lg transition-colors"
                        title="Edit quantity"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteGroceryItem(item.id)}
                        className="p-1.5 text-[#77716B] hover:text-[#E65A50] hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
