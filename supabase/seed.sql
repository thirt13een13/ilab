-- Subjects
insert into public.subjects(id,name,icon,color,description,display_order) values
('integrated-science','Integrated Science','🔬','#1D9E75','Cross-disciplinary experiments',1),
('physics','Physics','⚡','#0F6E56','Matter, energy and motion',2),
('chemistry','Chemistry','⚗️','#3B6D11','Reactions and properties of matter',3),
('biology','Biology','🧬','#27500A','Living organisms and processes',4);

-- Levels
insert into public.levels(id,label,description,display_order) values
('o-level','O Level','Secondary school foundation',1),
('a-level','A Level','Advanced secondary / pre-university',2);

-- Subject-level mapping
insert into public.subject_levels(subject_id,level_id) values
('integrated-science','o-level'),
('physics','o-level'),('physics','a-level'),
('chemistry','o-level'),('chemistry','a-level'),
('biology','o-level'),('biology','a-level');

-- Experiments (docker_port is unique per experiment)
insert into public.experiments(id,subject_id,level_id,title,description,theory,formula,duration,difficulty,topics,steps,docker_port,display_order) values

('ohms-law','physics','o-level','Ohm''s Law',
'Verify the relationship between voltage, current and resistance',
'Ohm''s Law: V = IR. Current through a conductor is proportional to voltage and inversely proportional to resistance.',
'V = I × R','30 min','Beginner',
array['Electricity','Current','Resistance'],
array['Drag a battery to the workspace','Add a resistor in series','Place an ammeter','Add a voltmeter across the resistor','Add a switch','Close the switch and record readings','Vary resistance and observe changes'],
3001,1),

('hookes-law','physics','o-level','Hooke''s Law',
'Investigate spring extension under varying loads',
'F = kx. The force needed to extend a spring is proportional to the extension.',
'F = k × x','25 min','Beginner',
array['Forces','Elasticity'],
array['Set up the retort stand','Hang the spring','Record natural length','Add 100g mass and record extension','Add more masses','Plot Force vs Extension','Calculate spring constant from gradient'],
3002,2),

('simple-pendulum','physics','o-level','Simple Pendulum',
'Determine the relationship between pendulum length and period',
'T = 2π√(L/g). Period depends only on length and gravitational acceleration.',
'T = 2π√(L/g)','35 min','Beginner',
array['Oscillations','Gravity'],
array['Attach bob to string','Measure string length','Displace bob by small angle','Time 10 oscillations','Calculate T = total/10','Repeat for different lengths','Plot T² vs L'],
3003,3),

('capacitor-charging','physics','a-level','Capacitor Charging & Discharging',
'Analyse exponential charge/discharge curves for RC circuits',
'V = V₀(1 - e^(-t/RC)). Time constant τ = RC.',
'V = V₀(1 - e^(-t/RC))','45 min','Advanced',
array['Capacitance','RC Circuits'],
array['Connect capacitor with resistor','Add DC supply and switch','Connect voltmeter across capacitor','Close switch and start timer','Record voltage at intervals','Plot V vs time','Calculate time constant'],
3004,1),

('photoelectric-effect','physics','a-level','Photoelectric Effect',
'Investigate light frequency vs stopping voltage',
'E = hf = φ + KE_max. Light behaves as photons with energy proportional to frequency.',
'E = hf = φ + ½mv²','40 min','Advanced',
array['Quantum physics','Light'],
array['Set up the photoelectric cell','Illuminate with monochromatic light','Measure stopping voltage per frequency','Record frequency-voltage pairs','Plot stopping voltage vs frequency','Find Planck''s constant from gradient','Find work function from y-intercept'],
3005,2),

('acid-base-titration','chemistry','o-level','Acid-Base Titration',
'Determine concentration of unknown acid using standard base',
'Titration determines concentration using C₁V₁ = C₂V₂.',
'C₁V₁ = C₂V₂','40 min','Intermediate',
array['Acids & Bases','Titration'],
array['Fill burette with NaOH','Pipette 25mL HCl into flask','Add phenolphthalein indicator','Place flask on white tile','Add NaOH slowly while swirling','Stop at persistent pink colour','Record NaOH volume used'],
3006,1),

('electrolysis-water','chemistry','o-level','Electrolysis of Water',
'Decompose water into hydrogen and oxygen using electric current',
'2H₂O → 2H₂ + O₂. Electrolysis splits water at electrodes.',
'2H₂O → 2H₂ + O₂','30 min','Beginner',
array['Electrolysis','Redox'],
array['Fill apparatus with dilute H₂SO₄','Connect electrodes to DC supply','Switch on and observe gas collection','Collect gas in inverted tubes','Record volume at each electrode','Test gases with splint','Confirm 2:1 hydrogen-to-oxygen ratio'],
3007,2),

('enthalpy-neutralisation','chemistry','a-level','Enthalpy of Neutralisation',
'Measure heat released during acid-base neutralisation',
'ΔH = -mcΔT. Energy released when acid and base form one mole of water.',
'ΔH = -mcΔT','50 min','Advanced',
array['Thermochemistry','Calorimetry'],
array['Measure 50mL 1.0M HCl into cup','Record initial temperature','Measure 50mL 1.0M NaOH','Mix and stir continuously','Record maximum temperature','Calculate ΔT then ΔH','Compare with -57.1 kJ/mol theoretical'],
3008,1),

('osmosis-potato','biology','o-level','Osmosis in Potato Cells',
'Investigate osmosis in potato cylinders in varying concentrations',
'Water moves through selectively permeable membrane from low to high solute concentration.',
'ΔΨ = ΨS + ΨP','45 min','Beginner',
array['Osmosis','Cell biology'],
array['Cut 5 equal potato cylinders','Weigh and record initial mass','Place each in different sucrose concentration','Leave for 30 minutes','Remove, blot dry and re-weigh','Calculate % mass change','Plot % change vs concentration'],
3009,1),

('photosynthesis-rate','biology','o-level','Rate of Photosynthesis',
'Measure effect of light intensity on photosynthesis in Elodea',
'Rate increases with light intensity until a limiting factor is reached: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
'6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂','40 min','Intermediate',
array['Photosynthesis','Plants'],
array['Cut fresh Elodea sprig underwater','Place in NaHCO₃ solution','Set lamp at 10cm','Count bubbles per minute','Move lamp further away and repeat','Record bubbles at each distance','Plot rate vs light intensity'],
3010,2),

('density-measurement','integrated-science','o-level','Density of Solids and Liquids',
'Calculate density using mass and volume measurements',
'ρ = m/V. Volume of irregular solids measured by displacement.',
'ρ = m/V','25 min','Beginner',
array['Measurement','Properties of matter'],
array['Measure mass on balance','Fill cylinder with water and record volume','Submerge solid and record new volume','Calculate volume by displacement','Calculate density','Repeat for different objects','Compare and identify materials'],
3011,1),

('heat-transfer','integrated-science','o-level','Methods of Heat Transfer',
'Demonstrate conduction, convection and radiation',
'Heat transfers by conduction through solids, convection through fluids, and radiation through electromagnetic waves.',
'Q = mcΔT','35 min','Beginner',
array['Heat','Energy transfer'],
array['Set up conduction experiment with metal rods','Apply heat and measure temperature along rod','Set up convection tube with coloured water','Heat one side and observe circulation','Set up radiation with Leslie cube','Measure temperature at different surfaces','Compare rates of each method'],
3012,2);

-- Components
insert into public.experiment_components(id,experiment_id,label,icon,description,type,value,display_order) values
('battery','ohms-law','Battery','🔋','9V DC source','source',9,1),
('resistor','ohms-law','Resistor','〰️','Fixed 100Ω resistor','resistor',100,2),
('variable-resistor','ohms-law','Variable Resistor','🎛️','Rheostat 0–500Ω','variable',100,3),
('ammeter','ohms-law','Ammeter','🔵','Measures current (A)','ammeter',null,4),
('voltmeter','ohms-law','Voltmeter','🔴','Measures voltage (V)','voltmeter',null,5),
('switch','ohms-law','Switch','🔌','Open/close circuit','switch',null,6),
('wire','ohms-law','Connecting Wire','➖','Conductor','wire',null,7),

('spring','hookes-law','Spring','🌀','Steel spring k=10 N/m','spring',10,1),
('mass-100','hookes-law','100g Mass','⬛','100g = 0.98N','mass',0.98,2),
('mass-200','hookes-law','200g Mass','⬛','200g = 1.96N','mass',1.96,3),
('mass-500','hookes-law','500g Mass','⬛','500g = 4.90N','mass',4.9,4),
('ruler','hookes-law','Ruler','📏','Measure extension in cm','measure',null,5),
('stand','hookes-law','Retort Stand','🏗️','Support structure','support',null,6),
('pointer','hookes-law','Pointer','▶️','Marks reference position','measure',null,7),

('bob','simple-pendulum','Pendulum Bob','⚫','Steel bob 50g','mass',0.05,1),
('string','simple-pendulum','String','〰️','Inextensible string','connector',null,2),
('clamp','simple-pendulum','Clamp Stand','🏗️','Fixed support','support',null,3),
('stopwatch','simple-pendulum','Stopwatch','⏱️','Time oscillations','measure',null,4),
('ruler-p','simple-pendulum','Ruler','📏','Measure string length','measure',null,5),
('protractor','simple-pendulum','Protractor','📐','Measure release angle','measure',null,6),

('capacitor','capacitor-charging','Capacitor','⬛','470μF electrolytic','capacitor',470,1),
('resistor-c','capacitor-charging','Resistor','〰️','10kΩ resistor','resistor',10000,2),
('dc-supply-c','capacitor-charging','DC Power Supply','🔋','9V DC source','source',9,3),
('voltmeter-c','capacitor-charging','Voltmeter','🔴','Measure capacitor voltage','voltmeter',null,4),
('switch-c','capacitor-charging','Switch','🔌','Start charging','switch',null,5),
('stopwatch-c','capacitor-charging','Stopwatch','⏱️','Time the charging','measure',null,6),

('photo-cell','photoelectric-effect','Photoelectric Cell','⬛','Vacuum photocell','detector',null,1),
('uv-lamp','photoelectric-effect','UV Lamp','💡','UV light source','source',null,2),
('colour-filter','photoelectric-effect','Colour Filters','🎨','Select light frequency','filter',null,3),
('galvanometer','photoelectric-effect','Galvanometer','🔵','Detect photoelectrons','ammeter',null,4),
('variable-psu','photoelectric-effect','Variable PSU','🎛️','Apply stopping voltage','source',null,5),
('voltmeter-ph','photoelectric-effect','Voltmeter','🔴','Measure stopping voltage','voltmeter',null,6),

('burette','acid-base-titration','Burette','🧪','50mL burette','vessel',null,1),
('conical-flask','acid-base-titration','Conical Flask','⚗️','250mL Erlenmeyer flask','vessel',null,2),
('pipette','acid-base-titration','Pipette','💧','25mL volumetric pipette','measure',null,3),
('indicator','acid-base-titration','Phenolphthalein','🟣','pH indicator drops','chemical',null,4),
('naoh','acid-base-titration','NaOH solution','🔵','0.1 mol/L standard base','chemical',0.1,5),
('hcl','acid-base-titration','HCl solution','🟡','Unknown concentration acid','chemical',null,6),
('stand-t','acid-base-titration','Burette Stand','🏗️','Holds burette upright','support',null,7),
('white-tile','acid-base-titration','White Tile','⬜','Background for colour change','support',null,8),

('electrolysis-cell','electrolysis-water','Electrolysis Cell','⚗️','Hoffman voltameter','vessel',null,1),
('dc-supply','electrolysis-water','DC Power Supply','🔋','6V DC source','source',6,2),
('electrodes','electrolysis-water','Platinum Electrodes','➖','Inert electrodes','conductor',null,3),
('ammeter-e','electrolysis-water','Ammeter','🔵','Measures current','ammeter',null,4),
('h2so4','electrolysis-water','Dilute H₂SO₄','🟡','Electrolyte solution','chemical',null,5),
('test-tubes','electrolysis-water','Test Tubes','🧪','Collect gas','vessel',null,6),
('splint','electrolysis-water','Wooden Splint','🪵','Test for gases','tool',null,7),

('poly-cup','enthalpy-neutralisation','Polystyrene Cup','🥛','Insulated calorimeter','vessel',null,1),
('hcl-e','enthalpy-neutralisation','1.0M HCl','🟡','50mL acid solution','chemical',1.0,2),
('naoh-e','enthalpy-neutralisation','1.0M NaOH','🔵','50mL base solution','chemical',1.0,3),
('thermometer-e','enthalpy-neutralisation','Thermometer','🌡️','Measure temperature','measure',null,4),
('stirrer','enthalpy-neutralisation','Glass Stirrer','〰️','Stir the mixture','tool',null,5),
('measuring-cyl','enthalpy-neutralisation','Measuring Cylinder','🧪','Measure volumes','measure',null,6),

('potato','osmosis-potato','Potato','🥔','Source of plant cells','specimen',null,1),
('scalpel','osmosis-potato','Scalpel','🔪','Cut into cylinders','tool',null,2),
('ruler-o','osmosis-potato','Ruler','📏','Measure cylinder length','measure',null,3),
('balance','osmosis-potato','Balance','⚖️','Measure mass','measure',null,4),
('beaker-distilled','osmosis-potato','Distilled Water','💧','0% sucrose solution','solution',0,5),
('beaker-10','osmosis-potato','10% Sucrose','🧂','10% sucrose','solution',10,6),
('beaker-20','osmosis-potato','20% Sucrose','🧂','20% sucrose','solution',20,7),
('beaker-30','osmosis-potato','30% Sucrose','🧂','30% sucrose','solution',30,8),
('forceps','osmosis-potato','Forceps','🥢','Handle cylinders','tool',null,9),
('timer-o','osmosis-potato','Timer','⏱️','30 min immersion','measure',null,10),

('elodea','photosynthesis-rate','Elodea Sprig','🌿','Aquatic plant','specimen',null,1),
('lamp','photosynthesis-rate','Lamp','💡','Light source','source',null,2),
('nahco3','photosynthesis-rate','NaHCO₃ Solution','💧','CO₂ source','solution',null,3),
('beaker-p','photosynthesis-rate','Beaker','⚗️','Hold plant and solution','vessel',null,4),
('ruler-ph','photosynthesis-rate','Ruler','📏','Measure lamp distance','measure',null,5),
('stopwatch-p','photosynthesis-rate','Stopwatch','⏱️','Count bubbles per min','measure',null,6),
('thermometer-p','photosynthesis-rate','Thermometer','🌡️','Monitor temperature','measure',null,7),

('balance-d','density-measurement','Electronic Balance','⚖️','Measure mass to 0.01g','measure',null,1),
('cylinder','density-measurement','Measuring Cylinder','🧪','100mL graduated','measure',null,2),
('water-beaker','density-measurement','Water','💧','For displacement','solution',null,3),
('metal-block','density-measurement','Metal Block','🔲','Unknown metal sample','specimen',null,4),
('stone','density-measurement','Stone','🪨','Irregular solid','specimen',null,5),
('thread','density-measurement','Thread','〰️','Lower solid into water','connector',null,6),

('bunsen','heat-transfer','Bunsen Burner','🔥','Heat source','source',null,1),
('metal-rod','heat-transfer','Metal Rod','➖','Conductor test rod','conductor',null,2),
('wax-pins','heat-transfer','Wax and Pins','📌','Show conduction rate','indicator',null,3),
('beaker-ht','heat-transfer','Beaker of Water','💧','Convection medium','vessel',null,4),
('dye','heat-transfer','Potassium Permanganate','🟣','Coloured tracer','chemical',null,5),
('thermometer','heat-transfer','Thermometer','🌡️','Measure temperature','measure',null,6),
('leslie-cube','heat-transfer','Leslie Cube','⬛','Radiation surfaces','vessel',null,7);

-- Variables
insert into public.experiment_variables(id,experiment_id,label,min_value,max_value,step_value,default_value,unit,display_order) values
('voltage','ohms-law','Voltage (V)',1,12,1,9,'V',1),
('resistance','ohms-law','Resistance (Ω)',10,500,10,100,'Ω',2),
('mass','hookes-law','Total mass (g)',100,1000,100,100,'g',1),
('springConstant','hookes-law','Spring constant (N/m)',5,50,5,10,'N/m',2),
('length','simple-pendulum','String length (cm)',10,100,5,50,'cm',1),
('angle','simple-pendulum','Release angle (°)',5,20,1,10,'°',2),
('capacitance','capacitor-charging','Capacitance (μF)',100,1000,100,470,'μF',1),
('rcResistance','capacitor-charging','Resistance (kΩ)',1,47,1,10,'kΩ',2),
('frequency','photoelectric-effect','Light frequency (×10¹⁴ Hz)',4,8,0.5,5.5,'×10¹⁴Hz',1),
('naohConcentration','acid-base-titration','NaOH concentration (mol/L)',0.05,0.5,0.05,0.1,'mol/L',1),
('hclVolume','acid-base-titration','HCl volume (mL)',10,50,5,25,'mL',2),
('current','electrolysis-water','Current (A)',0.5,5,0.5,2,'A',1),
('electrolysisTime','electrolysis-water','Time (min)',5,30,5,10,'min',2),
('hclConc','enthalpy-neutralisation','HCl concentration (mol/L)',0.5,2,0.25,1,'mol/L',1),
('naohConc','enthalpy-neutralisation','NaOH concentration (mol/L)',0.5,2,0.25,1,'mol/L',2),
('concentration','osmosis-potato','Sucrose concentration (%)',0,50,5,0,'%',1),
('time','osmosis-potato','Immersion time (min)',10,60,5,30,'min',2),
('lightDistance','photosynthesis-rate','Lamp distance (cm)',5,50,5,10,'cm',1),
('temperature','photosynthesis-rate','Temperature (°C)',10,40,5,25,'°C',2),
('mass-d','density-measurement','Object mass (g)',10,500,10,100,'g',1),
('volume-d','density-measurement','Water volume (mL)',50,200,10,100,'mL',2),
('heatTime','heat-transfer','Heating time (min)',1,10,1,5,'min',1);

-- Simulation rules
insert into public.simulation_rules(experiment_id,required_components,formula_type,formula_params,graph_x_key,graph_y_key,graph_x_label,graph_y_label) values
('ohms-law',array['battery','ammeter'],'ohms_law','{}','resistance','current','Resistance (Ω)','Current (A)'),
('hookes-law',array['spring','stand','ruler'],'hookes_law','{}','force','extension','Force (N)','Extension (m)'),
('simple-pendulum',array['bob','string','clamp','stopwatch'],'pendulum','{}','length','period','Length (cm)','Period (s)'),
('capacitor-charging',array['capacitor','resistor-c','dc-supply-c','voltmeter-c','switch-c'],'capacitor','{}','time','voltage','Time (s)','Voltage (V)'),
('photoelectric-effect',array['photo-cell','uv-lamp','galvanometer','variable-psu'],'photoelectric','{}','frequency','stoppingVoltage','Frequency (×10¹⁴ Hz)','Stopping voltage (V)'),
('acid-base-titration',array['burette','conical-flask','indicator','pipette'],'titration','{}','trial','volume','Trial','Volume NaOH (mL)'),
('electrolysis-water',array['electrolysis-cell','dc-supply','electrodes','ammeter-e'],'electrolysis','{}','time','volume','Time (min)','Gas volume (mL)'),
('enthalpy-neutralisation',array['poly-cup','thermometer-e','stirrer'],'enthalpy','{}','volume','temperature','Volume NaOH (mL)','Temperature (°C)'),
('osmosis-potato',array['potato','balance','timer-o'],'osmosis','{}','concentration','massChange','Sucrose (%)','% Mass change'),
('photosynthesis-rate',array['elodea','lamp','stopwatch-p'],'photosynthesis','{}','distance','bubbles','Distance (cm)','Bubbles/min'),
('density-measurement',array['balance-d','cylinder','water-beaker'],'density','{}','mass','density','Mass (g)','Density (g/cm³)'),
('heat-transfer',array['bunsen','thermometer'],'heat_transfer','{}','time','temperature','Time (min)','Temperature (°C)');