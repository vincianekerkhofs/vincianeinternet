import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface Props {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

const DATA: Record<string, { name: string; start: number; grid: number[][] }> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica - Box 1',
    start: 5,
    grid: [[-1,0,0,4], [1,0,0,4], [1,0,3,0], [1,0,3,0], [-1,0,3,0], [-1,0,0,4]],
  },
  'Am_blues': {
    name: 'Am Blues',
    start: 5,
    grid: [[-1,0,0,4], [1,0,0,4], [1,0,3,0], [1,0,3,0], [-1,2,3,0], [-1,0,0,4]],
  },
  'C_major_box1': {
    name: 'Do Mayor',
    start: 7,
    grid: [[1,-2,0,4], [0,-1,0,3], [1,0,3,0], [1,0,3,-4], [1,2,0,4], [1,-2,0,4]],
  },
};

const STR = ['e','B','G','D','A','E'];
const W = Dimensions.get('window').width;

export const ScaleFretboard: React.FC<Props> = ({ scaleName, isActive = false }) => {
  const d = DATA[scaleName];
  if (!d) return <Text style={{color:'red'}}>No encontrado: {scaleName}</Text>;
  
  const nf = d.grid[0].length;
  const cw = Math.floor((W - 100) / nf);

  return (
    <View style={css.box}>
      <Text style={css.ttl}>{d.name}</Text>
      
      {/* Table container */}
      <View style={css.tbl}>
        {d.grid.map((row, ri) => {
          const root = row.some(x => x < 0);
          return (
            <View key={ri} style={css.tr}>
              {/* Label cell */}
              <View style={[css.lbl, root ? css.lblR : css.lblG]}>
                <Text style={css.lblT}>{STR[ri]}</Text>
              </View>
              {/* Nut */}
              <View style={css.nut}/>
              {/* Data cells */}
              {row.map((v, ci) => {
                const ir = v < 0;
                const f = Math.abs(v);
                return (
                  <View key={ci} style={[css.td, {width:cw}]}>
                    {/* String line */}
                    <View style={[css.str, {height: 2+ri*0.5}]}/>
                    {/* Note */}
                    {v !== 0 ? (
                      <View style={[
                        css.note,
                        ir ? css.noteR : css.noteG,
                        isActive && css.noteA
                      ]}>
                        <Text style={css.fng}>{f}</Text>
                      </View>
                    ) : null}
                    {/* Fret line */}
                    <View style={css.frt}/>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
      
      {/* Fret numbers */}
      <View style={css.nums}>
        <View style={{width:40}}/>
        {[...Array(nf)].map((_,i) => (
          <View key={i} style={[css.numC,{width:cw}]}>
            <Text style={css.numT}>{d.start + i}</Text>
          </View>
        ))}
      </View>
      
      {/* Legend */}
      <View style={css.leg}>
        <View style={css.legI}><View style={[css.dot,{backgroundColor:'#FF6B35'}]}/><Text style={css.legT}>Raíz</Text></View>
        <View style={css.legI}><View style={[css.dot,{backgroundColor:'#00D68F'}]}/><Text style={css.legT}>Notas</Text></View>
        <Text style={css.allS}>✓ Todas suenan</Text>
      </View>
    </View>
  );
};

const css = StyleSheet.create({
  box: {alignItems:'center',padding:4},
  ttl: {fontSize:15,fontWeight:'bold',color:COLORS.primary,marginBottom:8},
  
  tbl: {backgroundColor:'#1E1810',borderRadius:6,padding:6},
  tr: {flexDirection:'row',alignItems:'center',marginVertical:2},
  
  lbl: {width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center'},
  lblG: {backgroundColor:'#00D68F'},
  lblR: {backgroundColor:'#FF6B35'},
  lblT: {color:'#FFF',fontSize:11,fontWeight:'bold'},
  
  nut: {width:4,height:30,backgroundColor:'#AAA',marginHorizontal:2},
  
  td: {height:34,flexDirection:'row',alignItems:'center',justifyContent:'center'},
  
  str: {position:'absolute',left:0,right:0,backgroundColor:'#A08060'},
  
  note: {width:28,height:28,borderRadius:14,borderWidth:2,alignItems:'center',justifyContent:'center',backgroundColor:'#222',zIndex:2},
  noteG: {borderColor:'#00D68F'},
  noteR: {borderColor:'#FF6B35'},
  noteA: {backgroundColor:'#00D68F'},
  
  fng: {color:'#FFF',fontSize:13,fontWeight:'bold'},
  
  frt: {position:'absolute',right:0,top:2,bottom:2,width:2,backgroundColor:'#555'},
  
  nums: {flexDirection:'row',marginTop:4},
  numC: {alignItems:'center'},
  numT: {fontSize:11,color:'#888',fontWeight:'600'},
  
  leg: {flexDirection:'row',marginTop:8,alignItems:'center',gap:12},
  legI: {flexDirection:'row',alignItems:'center',gap:4},
  dot: {width:10,height:10,borderRadius:5},
  legT: {fontSize:11,color:'#888'},
  allS: {fontSize:11,color:'#00D68F',fontWeight:'600'},
});
