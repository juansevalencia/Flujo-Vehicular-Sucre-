import osmnx as ox
import json

G = ox.graph_from_point(
    (-34.5574, -58.4466),  # Sucre y Libertador, Núñez
    dist=800,
    network_type="drive"
)

# Ver cómo queda
ox.plot_graph(G)

# Exportar a GeoJSON para usarlo después en NestJS
ox.save_graph_geopackage(G, filepath="graph.gpkg")

# Exportar nodos y aristas como JSON plano
import pandas as pd

nodes, edges = ox.graph_to_gdfs(G)

# Convertir a dataframe normal sin geometría
nodes_df = pd.DataFrame({
    'osmid': nodes.index,
    'y': nodes['y'],
    'x': nodes['x'],
})

edges_df = pd.DataFrame({
    'u': [u for u, v, k in edges.index],
    'v': [v for u, v, k in edges.index],
    'length': edges['length'].values,
    'name': edges['name'].values if 'name' in edges.columns else None,
    'maxspeed': edges['maxspeed'].values if 'maxspeed' in edges.columns else None,
})

# Reemplazar NaN por None para que sea JSON válido
edges_df = edges_df.where(pd.notnull(edges_df), None)

with open("nodes.json", "w") as f:
    json.dump(nodes_df.to_dict(orient="records"), f)

with open("edges.json", "w") as f:
    json.dump(edges_df.to_dict(orient="records"), f, default=str)

print(f"✅ Nodos: {len(nodes_df)}")
print(f"✅ Aristas: {len(edges_df)}")