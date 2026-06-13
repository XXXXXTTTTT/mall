import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '../../components/shop/IconButton.jsx';
import { IOSCard } from '../../components/shop/IOSCard.jsx';
import { ShopIcon } from '../../components/shop/ShopIcon.jsx';
import { ShopNavigationBar } from '../../components/shop/ShopNavigationBar.jsx';
import { addressService, authService } from '../../mock/mockService.js';

const EMPTY_FORM = {
  receiver: '',
  phone: '',
  province: '',
  city: '',
  detail: '',
};

export function AddressPage() {
  const user = authService.getUserSession();
  const [addresses, setAddresses] = useState(() => (user ? addressService.listByUserSync(user.id) : []));
  const [editingAddressId, setEditingAddressId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState('');

  function refreshAddresses() {
    if (!user) return;
    setAddresses(addressService.listByUserSync(user.id));
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreateForm() {
    setEditingAddressId('');
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
    setMessage('');
  }

  function openEditForm(address) {
    setEditingAddressId(address.id);
    setForm({
      receiver: address.receiver,
      phone: address.phone,
      province: address.province,
      city: address.city,
      detail: address.detail,
    });
    setIsFormOpen(true);
    setMessage('');
  }

  async function saveAddress(event) {
    event.preventDefault();
    if (!user) {
      setMessage('请先登录后管理收货地址');
      return;
    }
    const payload = {
      userId: user.id,
      receiver: form.receiver,
      phone: form.phone,
      province: form.province,
      city: form.city,
      detail: form.detail,
      isDefault: addresses.length === 0,
    };
    const result = editingAddressId
      ? await addressService.updateAddress(editingAddressId, {
          ...payload,
          isDefault: addresses.find((address) => address.id === editingAddressId)?.isDefault || false,
        })
      : await addressService.createAddress(payload);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setIsFormOpen(false);
    setEditingAddressId('');
    setForm(EMPTY_FORM);
    refreshAddresses();
  }

  async function setDefault(addressId) {
    if (!user) {
      setMessage('请先登录后管理收货地址');
      return;
    }
    const result = await addressService.setDefaultAddress(user.id, addressId);
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    refreshAddresses();
  }

  async function deleteAddress(addressId) {
    if (!user) {
      setMessage('请先登录后管理收货地址');
      return;
    }
    const result = await addressService.deleteAddress(addressId);
    if (!result.success) {
      setMessage(result.message);
      return;
    }
    refreshAddresses();
  }

  return (
    <>
      <ShopNavigationBar title="收货地址" />
      <main className="mx-auto min-h-screen max-w-md bg-slate-100 px-4 pb-6 pt-20 text-slate-900">
        <IOSCard as="header" className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Address</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">地址管理</h1>
            <button
              type="button"
              aria-label="新增地址"
              onClick={openCreateForm}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <ShopIcon name="plus" />
            </button>
          </div>
        </IOSCard>

        {isFormOpen ? (
          <IOSCard
            as="form"
            onSubmit={saveAddress}
            className="mt-5 space-y-4 p-5"
          >
          <h2 className="text-lg font-bold text-slate-950">{editingAddressId ? '编辑地址' : '新增地址'}</h2>
          <label className="block text-sm font-bold text-slate-700">
            收货人
            <input
              value={form.receiver}
              onChange={(event) => updateForm('receiver', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            手机号
            <input
              value={form.phone}
              onChange={(event) => updateForm('phone', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            省份
            <input
              value={form.province}
              onChange={(event) => updateForm('province', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            城市
            <input
              value={form.city}
              onChange={(event) => updateForm('city', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            详细地址
            <textarea
              value={form.detail}
              onChange={(event) => updateForm('detail', event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            保存地址
          </button>
          </IOSCard>
        ) : null}

        {message ? (
          <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          <p>{message}</p>
          {!user ? (
            <Link
              to="/shop/login"
              className="mt-3 inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              去登录
            </Link>
          ) : null}
          </div>
        ) : null}

        <section className="mt-5 space-y-4">
          {addresses.map((address) => (
            <IOSCard
              as="article"
              key={address.id}
              className="p-5"
            >
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-slate-950">{address.receiver}</h2>
              <span className="text-sm text-slate-500">{address.phone}</span>
              {address.isDefault ? <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">默认地址</span> : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {address.province} {address.city} {address.detail}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {!address.isDefault ? (
                <IconButton ariaLabel={`设置默认 ${address.receiver}`} icon="check" onClick={() => setDefault(address.id)} />
              ) : null}
              <IconButton ariaLabel={`编辑地址 ${address.receiver}`} icon="location" onClick={() => openEditForm(address)} />
              <IconButton ariaLabel={`删除 ${address.receiver}`} icon="trash" onClick={() => deleteAddress(address.id)} />
            </div>
            </IOSCard>
          ))}
        </section>
      </main>
    </>
  );
}
