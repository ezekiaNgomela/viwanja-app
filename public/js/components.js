const Components = {
    Header: () => `
        <nav class="glass-nav sticky top-0 z-[100] h-20 flex items-center px-6 bg-white/95 backdrop-blur-md border-b border-slate-100">
            <div class="max-w-7xl mx-auto w-full flex justify-between items-center">
                <div class="flex flex-col">
                    <h1 class="font-black text-2xl tracking-tighter uppercase leading-none">VIWANJA<span class="text-blue-600">.</span></h1>
                    <p class="text-[7px] font-bold text-slate-400 tracking-[0.4em] uppercase mt-1">Dar Es Salaam</p>
                </div>
                <div class="flex items-center gap-10">
                    <button onclick="setCat('squares')" id="btn-squares" class="text-[10px] font-black uppercase tracking-widest text-blue-600">Squares</button>
                    <button onclick="setCat('houses')" id="btn-houses" class="text-[10px] font-black uppercase tracking-widest text-slate-300">Houses</button>
                </div>
            </div>
        </nav>`,

    PropertyCard: (p) => {
        const isSold = p.status === 'sold';
        return `
        <article class="bg-white border border-slate-100 rounded-sm overflow-hidden shadow-sm animate__animated animate__fadeIn">
            <div class="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer" onclick="openModal('${p._id}')">
                <img src="${p.image}" class="w-full h-full object-cover ${isSold ? 'grayscale-[0.8]' : ''}">
                ${isSold ? `<div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div class="bg-red-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rotate-[-5deg] border border-white">SOLD OUT</div>
                </div>` : ''}
                <div class="absolute top-4 right-4 bg-black/80 px-3 py-1 text-white text-[9px] font-black uppercase tracking-widest">${p.price}</div>
            </div>
            <div class="p-5">
                <h4 class="text-[11px] font-black uppercase text-slate-900 truncate mb-1">${p.title}</h4>
                <p class="text-[9px] text-blue-600 font-bold uppercase tracking-tighter mb-4">${p.location}</p>
                <div class="flex gap-4 border-t border-slate-50 pt-4">
                    <button onclick="openModal('${p._id}')"><i data-lucide="info" class="w-5 h-5 text-slate-400"></i></button>
                    ${!isSold ? `<a href="https://wa.me/${p.sellerPhone}" class="text-green-500"><i data-lucide="message-circle" class="w-5 h-5"></i></a>` : ''}
                </div>
            </div>
        </article>`;
    },

    Modal: (p) => `
        <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/95 backdrop-blur-md" onclick="closeModal()"></div>
            <div class="relative bg-white w-full max-w-5xl h-fit max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-sm">
                <div class="w-full md:w-2/3 bg-black flex items-center">
                    <img src="${p.image}" class="w-full h-full object-contain">
                </div>
                <div class="w-full md:w-1/3 p-8 flex flex-col bg-white">
                    <button onclick="closeModal()" class="self-end text-slate-400 mb-4"><i data-lucide="x" class="w-6 h-6"></i></button>
                    <h2 class="text-2xl font-black uppercase tracking-tighter mb-2 text-slate-900">${p.title}</h2>
                    <p class="text-xl font-light text-blue-600 mb-6">${p.price}</p>
                    <div class="flex-1 overflow-y-auto pr-2 mb-6 text-[11px] font-bold uppercase text-slate-500 leading-relaxed">${p.desc}</div>
                    <div class="pt-6 border-t border-slate-100 flex items-center gap-4">
                        <img src="${p.sellerPic}" class="w-12 h-12 rounded-full object-cover">
                        <div>
                            <p class="text-[11px] font-black uppercase text-slate-800">${p.sellerName}</p>
                            <p class="text-[9px] text-slate-400 uppercase font-bold tracking-widest">${p.sellerLocation}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,

    Footer: () => `
        <footer class="bg-white border-t border-slate-100 py-20 mt-20 text-center">
            <h2 class="font-black text-2xl tracking-tighter uppercase mb-4 text-slate-900">VIWANJA<span class="text-blue-600">.</span></h2>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Dar Es Salaam, Tanzania</p>
            <a href="/login.html" class="text-[10px] font-black text-blue-600 uppercase tracking-widest">Staff Login</a>
        </footer>`
};