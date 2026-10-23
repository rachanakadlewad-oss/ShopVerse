"use client"
import { useState } from "react"
import {
  MapPin, Phone, User, Home, Building2, Map, Hash,
  Edit3, Trash2, Plus, CheckCircle2, X, Star
} from "lucide-react"
import { toast } from "sonner"
import API from "../lib/axios"
import { ButtonSpinner } from "./Loader"

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli",
  "Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
]

const LABELS = ["Home", "Work", "Other"]

const EMPTY_FORM = {
  label: "Home",
  name: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
}

function AddressForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  const field = (label, name, placeholder, icon, type = "text", required = true) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`input-base py-3 text-sm ${icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Label chips */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-2">Address Label</p>
        <div className="flex flex-wrap gap-2">
          {LABELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setForm((p) => ({ ...p, label: l }))}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                form.label === l
                  ? "border-purple-500/60 bg-purple-500/20 text-purple-300"
                  : "border-white/10 bg-white/4 text-[#9898b0] hover:border-white/20 hover:text-white"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {field("Full Name", "name", "John Doe", <User size={15} />)}
        {field("Phone Number", "phone", "10-digit number", <Phone size={15} />, "tel")}
      </div>

      {field("Address Line 1", "line1", "House/Flat no., Street, Area", <Home size={15} />)}

      <div className="grid gap-4 sm:grid-cols-2">
        {field("City", "city", "City", <Building2 size={15} />)}
        {field("Pincode", "pincode", "6-digit pincode", <Hash size={15} />)}
      </div>

      {/* State */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-[#9898b0] mb-1.5">
          State <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <Map size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555568] pointer-events-none" />
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className="input-base pl-10 py-3 text-sm appearance-none bg-[#111118]"
          >
            <option value="">Select state…</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Default toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setForm((p) => ({ ...p, isDefault: !p.isDefault }))}
          className={`relative h-5 w-9 rounded-full transition-colors ${form.isDefault ? "bg-purple-500" : "bg-white/10"}`}
        >
          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isDefault ? "translate-x-4" : "translate-x-0.5"}`} />
        </div>
        <span className="text-sm text-[#9898b0]">Set as default address</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost flex items-center gap-2 px-5 py-3 text-sm">
          <X size={14} />
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn-primary flex flex-1 items-center justify-center gap-2 py-3 text-sm">
          {saving ? <><ButtonSpinner />Saving…</> : <><CheckCircle2 size={15} />Save Address</>}
        </button>
      </div>
    </form>
  )
}

export default function AddressManager({ addresses = [], onAddressesChange, selectedId, onSelect }) {
  const [showForm, setShowForm] = useState(false)
  const [editingAddr, setEditingAddr] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const handleAdd = async (form) => {
    setSaving(true)
    try {
      const { data } = await API.post("/auth/addresses", form)
      onAddressesChange(data)
      setShowForm(false)
      toast.success("Address saved!")
    } catch {
      toast.error("Could not save address")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try {
      const { data } = await API.put(`/auth/addresses/${editingAddr._id}`, form)
      onAddressesChange(data)
      setEditingAddr(null)
      toast.success("Address updated!")
    } catch {
      toast.error("Could not update address")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (addrId) => {
    setDeletingId(addrId)
    try {
      const { data } = await API.delete(`/auth/addresses/${addrId}`)
      onAddressesChange(data)
      if (selectedId === addrId && onSelect) onSelect(null)
      toast.success("Address removed")
    } catch {
      toast.error("Could not delete address")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Saved address list */}
      {addresses.map((addr) => {
        const isSelected = selectedId === addr._id
        const isDeleting = deletingId === addr._id

        return (
          <div
            key={addr._id}
            onClick={() => onSelect && onSelect(addr)}
            className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
              isSelected
                ? "border-purple-500/60 bg-purple-500/8"
                : "border-white/8 bg-white/3 hover:border-white/15"
            } ${isDeleting ? "opacity-40" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Selection indicator */}
                <div className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isSelected ? "border-purple-500 bg-purple-500" : "border-white/20 bg-transparent"
                }`}>
                  {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-purple-400 border border-purple-500/30 bg-purple-500/10 rounded-full px-2 py-0.5">
                      {addr.label || "Home"}
                    </span>
                    {addr.isDefault && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                        <Star size={9} className="fill-amber-400" />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-sm text-white">{addr.name}</p>
                  <p className="text-sm text-[#9898b0] mt-0.5 leading-snug">
                    {addr.line1}, {addr.city}, {addr.state} – {addr.pincode}
                  </p>
                  {addr.phone && (
                    <p className="flex items-center gap-1 text-xs text-[#555568] mt-1">
                      <Phone size={10} />
                      {addr.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-shrink-0 gap-1">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setEditingAddr(addr); setShowForm(false) }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9898b0] hover:bg-white/8 hover:text-white transition-all"
                  title="Edit"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDelete(addr._id) }}
                  disabled={isDeleting}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#555568] hover:bg-rose-500/10 hover:text-rose-400 transition-all disabled:opacity-40"
                  title="Delete"
                >
                  {isDeleting ? <ButtonSpinner size={13} /> : <Trash2 size={13} />}
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Edit form */}
      {editingAddr && !showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#555568] mb-4">Edit Address</p>
          <AddressForm
            initial={editingAddr}
            onSave={handleUpdate}
            onCancel={() => setEditingAddr(null)}
            saving={saving}
          />
        </div>
      )}

      {/* Add new form */}
      {showForm && !editingAddr && (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#555568] mb-4">New Address</p>
          <AddressForm
            onSave={handleAdd}
            onCancel={() => setShowForm(false)}
            saving={saving}
          />
        </div>
      )}

      {/* Add button */}
      {!showForm && !editingAddr && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="btn-ghost flex w-full items-center justify-center gap-2 py-3 text-sm"
        >
          <Plus size={15} />
          Add New Address
        </button>
      )}
    </div>
  )
}
