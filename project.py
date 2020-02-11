import pandas as pd
from datetime import datetime, date, timezone
import calendar


def to_unix(row):
    t1 = calendar.timegm(row.timetuple())
    return t1


def to_box(row):
    return row['name'], [{"starting_time": row['start_unix'], "ending_time": row['end_unix']}]


calFire = pd.read_csv('./Datasets/calfire.csv')

# Data Cleaning Operations
calFire['start'] = pd.to_datetime(calFire['start'], infer_datetime_format=True, errors="ignore").dt.date
calFire['start_unix'] = calFire['start'].apply(to_unix)
calFire['end'] = pd.to_datetime(calFire['end'], infer_datetime_format=True, errors="ignore").dt.date
calFire['end_unix'] = calFire['end'].apply(to_unix)
calFire['start_year'] = calFire['start'].apply(lambda x: x.year)
calFire['end_year'] = calFire['end'].apply(lambda x: x.year)
calFire['intensity'] = calFire['acres']
calFire['label'], calFire['times'] = zip(*calFire.apply(to_box, axis=1))

yearList = calFire['start_year'].unique()

for x in yearList:
    temp = calFire[calFire['start_year'] == x].copy()
    temp.sort_values(by=['start'], inplace=True)
    intensity_max = temp['intensity'].max()
    temp['intensity'] = temp['intensity'].apply(lambda x: x/intensity_max)
    temp.to_csv('./Datasets/calfire_split/calFire'+ str(x) +'.csv')
    temp[['label', 'start_unix','end_unix', 'times','intensity']].to_csv('./Datasets/calfire_box_split/calFire'+ str(x) +'.csv')



calFire.sort_values(by=['start'], inplace=True)
intensity_max = calFire['intensity'].max()
calFire['intensity'] = calFire['intensity'].apply(lambda x: x/intensity_max)
calFire.to_csv('./Datasets/calfire_split/calFire1.csv')
calFire[['label', 'start_unix','end_unix', 'times','intensity']].to_csv('./Datasets/calfire_box_split/calFire1.csv')
