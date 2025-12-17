import React, { useState, useEffect } from "react";

export default function TourVisualizer2D() {
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);

  // CAMBIO 1: Modificar el estado uploadedMedia para incluir 'caption'
  const [uploadedMedia, setUploadedMedia] = useState(() => {
    const savedMedia = localStorage.getItem("valdivia_uploadedMedia");
    // Al cargar, aseguramos que cada item tenga 'caption' aunque sea vacío.
    const initialMedia = savedMedia ? JSON.parse(savedMedia) : {};

    // Si necesitas asegurar que todos los elementos existentes tengan la propiedad 'caption' al cargar:
    const mediaWithCaption = {};
    for (const stopId in initialMedia) {
      mediaWithCaption[stopId] = initialMedia[stopId].map((item) => ({
        ...item,
        caption: item.caption || "", // Asegura que exista el campo 'caption'
      }));
    }
    return mediaWithCaption;
  });

  const [autoPlay, setAutoPlay] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem("valdivia_comments");
    return saved ? JSON.parse(saved) : [];
  });

  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentOrigin, setCommentOrigin] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("valdivia_ratings");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentRating, setCurrentRating] = useState(0);

  const whatsappLink =
    "https://api.whatsapp.com/send?phone=593987497525&text=Hola%20quisiera%20informaci%C3%B3n%20sobre%20el%20recorrido%20tur%C3%ADstico%20en%20la%20Comuna%20Valdivia";

  /* ================== RECORRIDOS (Sin cambios en data) ================== */
  const tours = {
    cultura: {
      title: "Camino hacia la cultura de Valdivia",
      previewImage:
        "https://drive.google.com/file/d/1WL0gvtjZuDXFVv2QUgCAdvsqhafW6O_-/view?usp=drive_link",
      theme: {
        bg: "bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc,_#e5e7eb)]",
        button: "bg-blue-600",
        icon: "🏛️",
      },
      stops: [
        {
          id: 1,
          icon: "🏛️",
          name: "Museo de Sitio de la Comuna Valdivia",
          time: "10:00",
          description:
            "Este punto da inicio al recorrido turístico y permite conocer la historia, identidad y memoria cultural de la comuna Valdivia mediante piezas arqueológicas, objetos antiguos y relatos locales.",
          price: "Precio: $2 adultos, $1 niños",
          guide: "Guía: Disponible",
          location: "https://maps.app.goo.gl/fDLoTxmMj6iGATaU9",
          access:
            "Ruta de acceso: Bus intercantonal, transporte propio, taxi, tricimoto, caminando",
        },
        {
          id: 2,
          icon: "🏠",
          name: "Casa Patrimonial de la Comuna Valdivia",
          time: "10:00",
          description:
            "La casa patrimonial refleja las formas de vida tradicionales, los materiales constructivos y la organización social de épocas pasadas, fortaleciendo la identidad cultural local.",
          price: "Precio: $1",
          guide: "Guía: Auto-guiado",
          location: "https://maps.app.goo.gl/ApiABFB1DwFXwrpX7",
          access:
            "Ruta de acceso: Transporte propio, taxi, tricimoto, caminando",
        },
        {
          id: 3,
          icon: "🛠️",
          name: "Talleres de Artesanos Locales",
          time: "10:00",
          description:
            "Espacio donde los visitantes interactúan con artesanos locales, conociendo saberes ancestrales, técnicas tradicionales y el valor cultural de la artesanía.",
          price: "Precio: Desde $40",
          guide: "Guía: Disponible – Bajo reserva",
          location: "https://maps.app.goo.gl/vf1FqDjf1qThaifd9",
          access:
            "Ruta de acceso: Transporte propio, taxi, tricimoto, caminando",
        },
        {
          id: 4,
          icon: "🍽️",
          name: "Gastronomía Local de la Comuna Valdivia",
          time: "10:00",
          description:
            "Punto dedicado a la degustación de platos típicos preparados principalmente con productos del mar, resaltando la hospitalidad y tradición culinaria de la comunidad.",
          price: "Precio: Desde $3 a $7",
          guide: "Guía: N/A",
          location: "https://maps.app.goo.gl/pNtgnh39BRp45nSf9",
          access:
            "Ruta de acceso: Transporte propio, taxi, tricimoto, caminando",
        },
      ],
    },

    marino: {
      title: "Horizontes Marinos de Valdivia",
      previewImage:
        "https://via.placeholder.com/800x400/80c680/333333?text=Horizontes+Marinos",
      theme: {
        bg: "bg-[radial-gradient(circle_at_top,_#dcfce7,_#f0fdf4,_#e5e7eb)]",
        button: "bg-green-600",
        icon: "🌊",
      },
      stops: [
        {
          id: 5,
          icon: "🌊",
          name: "Parque Marino Costero",
          time: "09:00",
          description:
            "El Parque Marino Costero constituye un espacio clave para la conservación del ecosistema marino y costero de la comuna Valdivia, permitiendo conocer la biodiversidad del área y la importancia del manejo sostenible de los recursos naturales.",
          price: "Precio: Entrada gratuita",
          guide: "Guía: N/A",
          location: "https://maps.app.goo.gl/wbUN9BV76zpyCGQTA",
          access:
            "Ruta de acceso: Transporte propio, taxi, tricimoto, caminando",
        },
        {
          id: 6,
          icon: "🔭",
          name: "Mirador de Valdivia",
          time: "09:40",
          description:
            "El Mirador de Valdivia ofrece una vista panorámica del entorno costero y del océano Pacífico, siendo un espacio ideal para la contemplación del paisaje y la toma de fotografías.",
          price: "Precio: Gratuito",
          guide: "Guía: N/A",
          location: "https://maps.app.goo.gl/Ek7Hm1SxBDFBjLtG8",
          access:
            "Ruta de acceso: Transporte propio, taxi, tricimoto, caminando",
        },
        {
          id: 7,
          icon: "🏖️",
          name: "Recorrido en la Playa",
          time: "10:20",
          description:
            "El recorrido en la playa permite caminar a lo largo de la franja costera, disfrutar del paisaje natural y promover un turismo de bajo impacto y conciencia ambiental.",
          price: "Precio: Gratuito",
          guide: "Guía: N/A",
          location: "https://maps.app.goo.gl/i4bVohS8Tepb5N2b7",
          access:
            "Ruta de acceso: Transporte propio, taxi, tricimoto, caminando",
        },
        {
          id: 8,
          icon: "🍲",
          name: "Comedor Comunitario",
          time: "11:30",
          description:
            "El comedor comunitario ofrece una experiencia gastronómica tradicional preparada por los habitantes de la comuna, cerrando el recorrido natural con una vivencia cultural y social.",
          price: "Precio: Desde $3 a $7",
          guide: "Guía: N/A",
          location: "https://maps.app.goo.gl/zPU73qMFCicGzRDK9",
          access:
            "Ruta de acceso: Transporte propio, taxi, tricimoto, caminando",
        },
      ],
    },
  };

  const stops = selectedTour ? tours[selectedTour].stops : [];

  /* ================== PERSISTENCIA (Sin cambios) ================== */
  useEffect(() => {
    localStorage.setItem("valdivia_ratings", JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem("valdivia_comments", JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(
      "valdivia_uploadedMedia",
      JSON.stringify(uploadedMedia)
    );
  }, [uploadedMedia]);

  /* ================== LÓGICA DE COMENTARIOS (Sin cambios) ================== */
  const handleDeleteComment = (index) => {
    setComments((prevComments) => prevComments.filter((_, i) => i !== index));
  };

  const handleStartEdit = (index, text) => {
    setEditingIndex(index);
    setEditingText(text);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingText.trim() !== "") {
      setComments((prevComments) =>
        prevComments.map((comment, i) =>
          i === editingIndex ? { ...comment, text: editingText } : comment
        )
      );
      setEditingIndex(null);
      setEditingText("");
    }
  };

  /* ================== AUTOPLAY (Sin cambios) ================== */
  useEffect(() => {
    if (!autoPlay || !stops.length) return;

    const interval = setInterval(() => {
      setSelectedStop(stops[currentIndex]);
      setCurrentIndex((prev) => (prev + 1) % stops.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay, currentIndex, stops]);

  /* ================== MEDIA (Funciones Subir y Eliminar) ================== */
  const handleMediaUpload = (e, stopId) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      // CAMBIO 2: Inicializar 'caption' como cadena vacía
      const newMediaItem = {
        src: ev.target.result,
        type: file.type,
        caption: "",
      };

      setUploadedMedia((prev) => ({
        ...prev,
        [stopId]: [...(prev[stopId] || []), newMediaItem],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleMediaDelete = (stopId, indexToDelete) => {
    setUploadedMedia((prev) => ({
      ...prev,
      [stopId]: (prev[stopId] || []).filter((_, i) => i !== indexToDelete),
    }));
  };

  // CAMBIO 3: Nueva función para actualizar el caption de una imagen
  const handleUpdateMediaCaption = (stopId, mediaIndex, newCaption) => {
    setUploadedMedia((prev) => ({
      ...prev,
      [stopId]: (prev[stopId] || []).map((media, i) =>
        i === mediaIndex ? { ...media, caption: newCaption } : media
      ),
    }));
  };

  /* ================== DETALLE (Con visualización, eliminación y caption de media) ================== */
  if (selectedStop) {
    const theme = tours[selectedTour].theme;
    return (
      <div className={`min-h-screen p-6 ${theme.bg}`}>
        <button
          onClick={() => setSelectedStop(null)}
          // AUMENTADO TAMAÑO DE TEXTO
          className="mb-4 text-2x1 text-blue-700 font-semibold"
        >
          ← Volver al recorrido
        </button>

        <div className="bg-white/90 p-8 rounded-2xl shadow-xl max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-4">
            {" "}
            {/* AUMENTADO: text-4xl -> text-5xl */}
            {selectedStop.icon} {selectedStop.name}
          </h2>
          <p className="text-xl text-gray-500 mb-2">
            🕘 Hora: {selectedStop.time}
          </p>{" "}
          {/* AUMENTADO: text-lg -> text-xl */}
          <p className="text-2xl mb-6">{selectedStop.description}</p>{" "}
          {/* AUMENTADO: text-lg -> text-xl */}
          <div className="bg-blue-50 p-6 rounded-xl space-y-2">
            <p className="text-2xl font-semibold">{selectedStop.price}</p>{" "}
            {/* AUMENTADO: text-base -> text-xl */}
            <p className="text-2xl">{selectedStop.guide}</p>{" "}
            {/* AUMENTADO: text-base -> text-xl */}
            <p className="text-2xl">
              📍{" "}
              <a
                href={selectedStop.location}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Ubicación en el mapa
              </a>
            </p>
            <p className="text-2xl">{selectedStop.access}</p>{" "}
            {/* AUMENTADO: text-base -> text-xl */}
          </div>
          <h3 className="text-3xl font-bold mt-8 mb-4">
            {" "}
            {/* AUMENTADO: text-xl -> text-3xl, más margen */}
            📷📹 Registro audiovisual
          </h3>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleMediaUpload(e, selectedStop.id)}
            // AÑADIDO ESTILOS BÁSICOS PARA HACER EL INPUT MÁS VISIBLE
            className="text-xl p-2 border rounded-lg"
          />
          <div className="grid grid-cols-2 gap-6 mt-6">
            {" "}
            {/* AUMENTADO ESPACIO */}
            {(uploadedMedia[selectedStop.id] || []).map((m, i) => (
              // CAMBIO 4: Contenedor para la imagen/video y su caption/input
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col"
              >
                <div className="h-48 w-full rounded-xl overflow-hidden bg-gray-200 relative group mb-2">
                  {m.type.startsWith("video") ? (
                    <video controls className="w-full h-full object-cover">
                      <source src={m.src} />
                    </video>
                  ) : (
                    <img
                      src={m.src}
                      alt="registro"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Botón de eliminar (Aumentado ligeramente) */}
                  <button
                    onClick={() => handleMediaDelete(selectedStop.id, i)}
                    className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full opacity-90 hover:opacity-100 transition duration-200"
                    aria-label="Eliminar archivo"
                    title="Eliminar archivo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* CAMBIO 5: Input para el caption */}
                <input
                  type="text"
                  value={m.caption}
                  onChange={(e) =>
                    handleUpdateMediaCaption(selectedStop.id, i, e.target.value)
                  }
                  placeholder="Añadir descripción de la imagen/video"
                  className="w-full p-2 border rounded-md text-base mt-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================== LISTA DE PUNTOS ================== */
  // ... (El resto de esta sección no necesita cambios)
  if (selectedTour) {
    const theme = tours[selectedTour].theme;
    return (
      <div className={`min-h-screen p-6 ${theme.bg}`}>
        <button
          onClick={() => setSelectedTour(null)}
          // AUMENTADO TAMAÑO DE TEXTO
          className="mb-4 text-2xl text-blue-700 font-semibold"
        >
          ← Volver a recorridos
        </button>

        <h1 className="text-6xl font-bold text-center mb-12">
          {" "}
          {/* AUMENTADO: text-4xl -> text-5xl */}
          {theme.icon} {tours[selectedTour].title}
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {" "}
          {/* AUMENTADO ESPACIO */}
          {stops.map((stop) => (
            <div
              key={stop.id}
              className="bg-white/80 p-8 rounded-2xl shadow-lg" /* AUMENTADO PADDING */
            >
              <h2 className="text-4xl font-bold mb-4">
                {" "}
                {/* AUMENTADO: text-2xl -> text-3xl */}
                {stop.icon} {stop.name}
              </h2>
              <p className="text-2xl text-gray-500 mb-6">
                🕘 Hora: {stop.time}
              </p>{" "}
              {/* AUMENTADO: text-base -> text-xl */}
              <button
                onClick={() => setSelectedStop(stop)}
                // AUMENTADO BOTÓN: px-6 py-4 rounded-2xl text-lg -> px-8 py-5 rounded-3xl text-xl
                className={`${theme.button} text-white px-8 py-5 rounded-3xl text-xl font-semibold`}
              >
                Ver detalle
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================== PÁGINA PRINCIPAL ================== */
  // ... (El resto del código no necesita cambios para esta funcionalidad)
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc,_#e5e7eb)] p-6">
      <h1 className="text-7xl font-bold text-center mb-8">
        {" "}
        {/* AUMENTADO: text-5xl -> text-6xl */}
        Circuitos Turísticos – Comuna de Valdivia
      </h1>

      <p className="max-w-5xl mx-auto text-center text-gray-700 text-xl mb-10">
        {" "}
        {/* AUMENTADO: text-lg -> text-xl */}
        La comuna Valdivia se localiza en la provincia de Santa Elena, en la
        región litoral del Ecuador. Se caracteriza por su estrecha relación con
        el mar, su patrimonio cultural ancestral y su potencial para el
        desarrollo del turismo sostenible bajo los principios del Manejo Costero
        Integrado.
      </p>

      <iframe
        title="Mapa Comuna Valdivia"
        src="https://www.google.com/maps?q=Valdivia+Santa+Elena+Ecuador&output=embed"
        width="100%"
        height="320"
        className="rounded-2xl shadow-xl mb-14"
        loading="lazy"
      ></iframe>

      {/* RECORRIDOS CON IMÁGENES */}
      <div className="flex flex-col md:flex-row gap-10 justify-center mb-12 max-w-6xl mx-auto">
        {" "}
        {/* AUMENTADO ESPACIO */}
        {/* Card para Tour Cultura */}
        <div
          onClick={() => setSelectedTour("cultura")}
          className="cursor-pointer bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
        >
          <img
            src={tours.cultura.previewImage}
            alt="Camino hacia la cultura de Valdivia"
            className="w-full h-56 object-cover" /* AUMENTADO: h-48 -> h-56 */
          />
          <div className="p-8 text-center">
            {" "}
            {/* AUMENTADO PADDING */}
            <button
              // AUMENTADO BOTÓN PRINCIPAL: text-2xl, py-4, px-8 -> text-3xl, py-5, px-10
              className="bg-blue-600 text-white px-20 py-5 rounded-3xl text-3xl font-semibold w-full"
            >
              {tours.cultura.theme.icon} {tours.cultura.title}
            </button>
          </div>
        </div>
        {/* Card para Tour Marino */}
        <div
          onClick={() => setSelectedTour("marino")}
          className="cursor-pointer bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
        >
          <img
            src={tours.marino.previewImage}
            alt="Horizontes Marinos de Valdivia"
            className="w-full h-56 object-cover" /* AUMENTADO: h-48 -> h-56 */
          />
          <div className="p-8 text-center">
            {" "}
            {/* AUMENTADO PADDING */}
            <button
              // AUMENTADO BOTÓN PRINCIPAL: text-2xl, py-4, px-8 -> text-3xl, py-5, px-10
              className="bg-green-600 text-white px-10 py-5 rounded-3xl text-3xl font-semibold w-full"
            >
              {tours.marino.theme.icon} {tours.marino.title}
            </button>
          </div>
        </div>
      </div>
      {/* FIN RECORRIDOS CON IMÁGENES */}

      {/* ================== CALIFICACIÓN GENERAL ================== */}
      <div className="max-w-3xl mx-auto bg-white/90 p-10 rounded-2xl shadow-xl mb-16 text-center">
        {" "}
        {/* AUMENTADO PADDING */}
        <h2 className="text-5xl font-bold mb-6">
          {" "}
          {/* AUMENTADO: text-3xl -> text-4xl */}⭐ Calificación general de la
          experiencia
        </h2>
        <div className="flex justify-center gap-3 text-5xl mb-6">
          {" "}
          {/* AUMENTADO: text-4xl -> text-5xl, más gap */}
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setCurrentRating(star)}
              className={`cursor-pointer ${
                currentRating >= star ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <button
          onClick={() => {
            if (currentRating > 0) {
              setRatings([...ratings, currentRating]);
              setCurrentRating(0);
            }
          }}
          // AUMENTADO BOTÓN: px-6 py-3 rounded-2xl text-lg -> px-8 py-4 rounded-3xl text-xl
          className="bg-yellow-500 text-white px-8 py-4 rounded-3xl text-xl font-semibold"
        >
          Guardar calificación
        </button>
        {ratings.length > 0 && (
          <div className="mt-8">
            <p className="text-2xl font-semibold mb-3">
              {" "}
              {/* AUMENTADO: text-lg -> text-xl */}
              Promedio de calificación
            </p>
            <div className="flex justify-center gap-1 text-4xl">
              {" "}
              {/* AUMENTADO: text-3xl -> text-4xl */}
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i <
                    Math.round(
                      ratings.reduce((a, b) => a + b, 0) / ratings.length
                    )
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-2xl text-gray-600 mt-2">
              {" "}
              {/* AUMENTADO: text-base -> text-xl */}
              {(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(
                1
              )}{" "}
              / 5
            </p>
          </div>
        )}
      </div>

      {/* ================== COMENTARIOS ================== */}
      <div className="max-w-4xl mx-auto bg-white/90 p-10 rounded-2xl shadow-xl">
        {" "}
        {/* AUMENTADO PADDING */}
        <h2 className="text-5xl font-bold mb-6">
          {" "}
          {/* AUMENTADO: text-3xl -> text-4xl */}
          💬 Comentarios de los visitantes
        </h2>
        <input
          type="text"
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
          placeholder="Nombre del visitante"
          className="w-full p-4 border rounded-xl text-xl mb-4" /* AUMENTADO: text-lg -> text-xl */
        />
        <input
          type="text"
          value={commentOrigin}
          onChange={(e) => setCommentOrigin(e.target.value)}
          placeholder="Ciudad o país de origen"
          className="w-full p-4 border rounded-xl text-xl mb-4" /* AUMENTADO: text-lg -> text-xl */
        />
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Escribe tu comentario sobre la experiencia turística en la comuna Valdivia..."
          className="w-full p-4 border rounded-xl text-xl mb-6" /* AUMENTADO: text-lg -> text-xl, más margen */
        />
        <button
          onClick={() => {
            if (
              commentName.trim() !== "" &&
              commentOrigin.trim() !== "" &&
              commentText.trim() !== ""
            ) {
              setComments([
                ...comments,
                {
                  name: commentName,
                  origin: commentOrigin,
                  text: commentText,
                },
              ]);
              setCommentName("");
              setCommentOrigin("");
              setCommentText("");
            }
          }}
          // AUMENTADO BOTÓN: px-6 py-3 rounded-2xl text-lg -> px-8 py-4 rounded-3xl text-xl
          className="bg-blue-600 text-white px-8 py-4 rounded-3xl text-xl font-semibold"
        >
          Enviar comentario
        </button>
        <div className="mt-8 space-y-4">
          {" "}
          {/* AUMENTADO ESPACIO */}
          {comments.map((c, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-xl text-xl">
              {" "}
              {/* AUMENTADO PADDING y text-lg -> text-xl */}
              {editingIndex === i ? (
                // MODO EDICIÓN
                <div>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full p-3 border rounded-xl text-xl mb-3" /* AUMENTADO: text-lg -> text-xl, más padding */
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEdit}
                      // AUMENTADO BOTÓN: px-4 py-2 rounded-xl text-sm -> px-6 py-3 rounded-2xl text-base, **AÑADIDO mr-4**
                      className="bg-green-500 text-white px-6 py-3 rounded-2xl text-base font-semibold mr-4"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      // AUMENTADO BOTÓN: px-4 py-2 rounded-xl text-sm -> px-6 py-3 rounded-2xl text-base
                      className="bg-gray-500 text-white px-6 py-3 rounded-2xl text-base font-semibold"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // MODO VISUALIZACIÓN
                <div>
                  <p className="font-semibold">
                    {c.name}{" "}
                    <span className="text-gray-500 font-normal">
                      – {c.origin}
                    </span>
                  </p>
                  <p className="mt-2">{c.text}</p>
                  <div className="mt-3 flex gap-4">
                    <button
                      onClick={() => handleStartEdit(i, c.text)}
                      // AUMENTADO: text-sm -> text-base, **AÑADIDO mr-4**
                      className="text-base font-semibold text-blue-600 hover:text-blue-800 mr-4"
                    >
                      ✏️ Modificar
                    </button>
                    <button
                      onClick={() => handleDeleteComment(i)}
                      // CORREGIDO text-1g a text-base, **AÑADIDO text-base**
                      className="text-base font-semibold text-red-600 hover:text-red-800"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        {" "}
        {/* AUMENTADO MARGEN */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          // AUMENTADO BOTÓN PRINCIPAL: px-8 py-4 rounded-2xl text-lg -> px-12 py-6 rounded-3xl text-2xl
          className="bg-green-500 text-white px-12 py-6 rounded-3xl text-5xl font-semibold"
        >
          💬 Reservar por WhatsApp
        </a>
      </div>
    </div>
  );
}
